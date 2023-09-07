using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;

namespace TilePlanner_Server_RESTAPI.Auth
{
#if AUTHALT
    public class Authenticate
    {
        private readonly IConfiguration configuration;
        private readonly MongoWork mongoWork;

        public Authenticate(IConfiguration configuration, MongoWork mongoWork)
        {
            this.configuration = configuration;
            this.mongoWork = mongoWork;
        }

        public async Task<ReturnTokenData> AuthenticateThis(User user)
        {
            try
            {
                var role = await mongoWork.FindRoleByUserId(user.Id);
                if (role == null)
                {
                    role = await mongoWork.AddNewRole(user.Id);
                }

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Role, role.AccessLevel.ToString())
                };

                var token = new JwtSecurityToken(
                    issuer: configuration.GetValue<string>("JWT:Issuer") ?? "Issuer",
                    audience: configuration.GetValue<string>("JWT:Audience") ?? "Audience",
                    claims: claims,
                    notBefore: DateTime.Now,
                    expires: DateTime.Now.AddHours(configuration.GetValue<int>("JWT:Lifetime")),
                    signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration.GetValue<string>("JWT:Key") ?? "This is the key for this app")), SecurityAlgorithms.HmacSha256));
                var jwtstring = new JwtSecurityTokenHandler().WriteToken(token);

                return new ReturnTokenData { Token = jwtstring, UserID = user.Id };
            }
            catch (Exception)
            {
                return default;
            }
        }
    }

#endif
}
