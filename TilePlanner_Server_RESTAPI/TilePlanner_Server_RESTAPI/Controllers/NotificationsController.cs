using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;

namespace TilePlanner_Server_RESTAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
#if AUTHALT
#if AUTHALT_ENABLED
    [Authorize]
#endif
#endif
    public class NotificationsController : ControllerBase
    {
        private MongoWork mongoWork;

        public NotificationsController(MongoWork mongoWork)
        {
            this.mongoWork = mongoWork;
        }

        [HttpGet("/getNotificationsForUser")]
        [Produces("application/json")]
        public async Task<IActionResult> GetNotificationsForUser(string userId)
        {
            try
            {
                return Ok(await mongoWork.GetNotificationsForUser(userId));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        [HttpPost("/addOrUpdateNotification")]
        [Produces("application/json")]
        public async Task<IActionResult> AddOrUpdateNotification([FromBody] Notification notification)
        {
            try
            {
                return Ok(await mongoWork.CreateUpdateNotification(notification));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        [HttpDelete("/deleteNotification")]
        public async Task<IActionResult> DeleteNotification([FromBody] Notification notification)
        {
            try
            {
                await mongoWork.DeleteNotification(notification);
                return Ok(notification);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        [HttpDelete("/clearAllNotifications")]

        public async Task<IActionResult> ClearAllNotifications([FromBody] User user)
        {
            try
            {
                await mongoWork.DeleteAllNotificationsForUser(user.Id);
                return Ok("Done"); 
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }



    }

}
