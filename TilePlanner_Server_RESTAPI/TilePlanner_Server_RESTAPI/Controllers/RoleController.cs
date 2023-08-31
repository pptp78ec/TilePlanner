using Microsoft.AspNetCore.Mvc;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;

namespace TilePlanner_Server_RESTAPI.Controllers
{
    [Route("api")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private MongoWork MongoWork;

        public RoleController(MongoWork mongoWork)
        {
            MongoWork = mongoWork;
        }

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

        [HttpPost("/updateRole")]
        [Produces("application/json")]
        public async Task<IActionResult> UpdateRole(RoleUpdateFields roleUpdateFields)
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
