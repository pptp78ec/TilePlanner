using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;

namespace TilePlanner_Server_RESTAPI.Auth
{
#if AUTHALT

    /// <summary>
    /// Class to authenticate users. Creates JWT token based on data from apsettings.json and user data from DB. Created as singleton
    /// </summary>
    public class Authenticate
    {
        private readonly IConfiguration configuration;
        private readonly MongoContext mongoWork;

        public Authenticate(IConfiguration configuration, MongoContext mongoWork)
        {
            this.configuration = configuration;
            this.mongoWork = mongoWork;
        }

        /// <summary>
        /// Authenticates user by creating JWT token.
        /// </summary>
        /// <param name="user">User object</param>
        /// <returns></returns>

        public async Task<ReturnTokenDataDTO> AuthenticateThis(User user)
        {
            try
            {
                var role = await mongoWork.FindRoleByUserId(user.Id);
                if (role == null)
                {
                    role = await mongoWork.AddNewRole(user.Id);
                }
                await CheckIfCurrentRoleIsExpiredAndSetBasic(user.Id);
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Role, role.AccessLevel.ToString()),
                    new Claim("Id", user.Id)
                };
                var token = new JwtSecurityToken(
                    issuer: configuration.GetValue<string>("JWT:Issuer") ?? "Issuer",
                    audience: configuration.GetValue<string>("JWT:Audience") ?? "Audience",
                    claims: claims,
                    notBefore: DateTime.Now,
                    expires: DateTime.Now.AddHours(configuration.GetValue<int>("JWT:Lifetime")),
                    signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration.GetValue<string>("JWT:Key") ?? "This is the key for this app")), SecurityAlgorithms.HmacSha256));
                var jwtstring = new JwtSecurityTokenHandler().WriteToken(token);
                return new ReturnTokenDataDTO { Token = jwtstring, UserID = user.Id };
            }
            catch (Exception)
            {
                return default;
            }
        }
        /// <summary>
        /// Checks if current user's Role with paid access level is expired and if true sets access level to BASIC
        /// </summary>
        /// <returns></returns>
        private async Task CheckIfCurrentRoleIsExpiredAndSetBasic(string userId)
        {
            var role = await mongoWork.FindRoleByUserId(userId);
            if (role.EndTime < DateTime.Now && role.AccessLevel != ORM.Roles.AccessLevel.BASIC)
                await mongoWork.UpdateSupbscription(userId, ORM.Roles.AccessLevel.BASIC, 0);
        }

        /// <summary>
        /// Checks if current user's id in token matches specified user's Id in request's body
        /// </summary>
        /// <param name="userId">User's ID in request body</param>
        /// <param name="controller">Controller instance</param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> checkIfUserIsValidToEditAsync(string userId, ControllerBase controller, CancellationToken cancellationToken = default)
        {
            return await Task.Run(() =>
            {
                    var token = controller.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                    var handler = new JwtSecurityTokenHandler();
                    var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
                    if (jsonToken != null)
                    {
                        var idClaimVal = jsonToken.Claims.First(x => x.Type == "Id").Value;
                        if (idClaimVal != userId)
                        {
                            return false;
                        }
                        return true;
                    }
                    return false;

            });
        }
    }




#endif
}
