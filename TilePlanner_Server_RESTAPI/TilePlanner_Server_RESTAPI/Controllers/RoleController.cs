using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TilePlanner_Server_RESTAPI.Auth;
using TilePlanner_Server_RESTAPI.DBConnection;

namespace TilePlanner_Server_RESTAPI.Controllers
{
    /// <summary>
    /// Role API Controller
    /// </summary>
    [ApiController]
#if AUTHALT
#if AUTHALT_ENABLED
    [Authorize]
#endif
#endif
    public class RoleController : ControllerBase
    {
        private readonly MongoContext MongoWork;
        private readonly Authenticate authenticate;

        public RoleController(MongoContext MongoWork, Authenticate authenticate)
        {
            this.MongoWork = MongoWork;
            this.authenticate = authenticate;

        }

        /// <summary>
        /// Gets current role for specified user
        /// </summary>
        /// <param name="userId">User's Id</param>
        /// <returns></returns>
        [HttpGet("/geturole")]
        [Produces("application/json")]
        public async Task<IActionResult> GetRoleUser(string userId, CancellationToken token = default)
        {
            try
            {
                return Ok(await MongoWork.FindRoleByUserId(userId, token));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Gets role by it's Id
        /// </summary>
        /// <param name="roleID">Role's id</param>
        /// <returns></returns>
        [HttpGet("/getrolebyid")]
        [Produces("application/json")]
        public async Task<IActionResult> GetRoleById(string roleID, CancellationToken token = default)
        {
            try
            {
                return Ok(await MongoWork.FindRoleById(roleID, token));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Sets user's current subscription method to BASIC and returns regenerated JWT token
        /// </summary>
        /// <param name="userId">Id of a user</param>
        /// <returns></returns>
        [HttpGet("/setSubscriptionToBasic")]
        [Produces("application/json")]
        public async Task<IActionResult> setSubscriptionToBasic(string userId, CancellationToken token = default)
        {
            try
            {
                await MongoWork.UpdateSupbscription(userId, ORM.Roles.AccessLevel.BASIC, 0, token);
                return Ok((await authenticate.AuthenticateThis(await MongoWork.FindUserById(userId, token))).Token);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }
    }
}
