using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;

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
        private MongoContext MongoWork;

        public RoleController(MongoContext mongoWork)
        {
            MongoWork = mongoWork;
        }

        /// <summary>
        /// Gets current role for specified user
        /// </summary>
        /// <param name="userId">User's Id</param>
        /// <returns></returns>
        [HttpGet("/geturole")]
        [Produces("application/json")]
        public async Task<IActionResult> GetRoleUser(string userId)
        {
            try
            {
                return Ok(await MongoWork.FindRoleByUserId(userId));
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
        public async Task<IActionResult> GetRoleById(string roleID)
        {
            try
            {
                return Ok(await MongoWork.FindRoleById(roleID));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Updates a role
        /// </summary>
        /// <param name="roleUpdateFields">Role's fields</param>
        /// <returns></returns>
        [HttpPost("/updateRole")]
        [Produces("application/json")]
        public async Task<IActionResult> UpdateRole([FromBody] RoleUpdateFieldsDTO roleUpdateFields)
        {
            try
            {
                return Ok(await MongoWork.UpdateRole(roleUpdateFields.UserId, roleUpdateFields.AccessLevel, roleUpdateFields.DaysToAdd));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }
    }
}
