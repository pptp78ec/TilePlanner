using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;

namespace TilePlanner_Server_RESTAPI.Controllers
{
    /// <summary>
    /// Notifications API controller
    /// </summary>
    [ApiController]
#if AUTHALT
#if AUTHALT_ENABLED
    [Authorize]
#endif
#endif
    public class NotificationsController : ControllerBase
    {
        private MongoContext mongoWork;

        public NotificationsController(MongoContext mongoWork)
        {
            this.mongoWork = mongoWork;
        }

        /// <summary>
        /// Get's user's all notifications from created tasks
        /// </summary>
        /// <param name="userId">User's Id</param>
        /// <returns></returns>
        [HttpGet("/getNotificationsForUser")]
        [Produces("application/json")]
        public async Task<IActionResult> GetNotificationsForUser(string userId, CancellationToken token = default)
        {
            try
            {
                return Ok(await mongoWork.GetNotificationsForUser(userId, token));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Adds or updates existing notification
        /// </summary>
        /// <param name="notification">Notification</param>
        /// <returns></returns>
        [HttpPost("/addOrUpdateNotification")]
        [Produces("application/json")]
        public async Task<IActionResult> AddOrUpdateNotification([FromBody] Notification notification, CancellationToken token = default)
        {
            try
            {
                return Ok(await mongoWork.CreateUpdateNotification(notification, token));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Deletes
        /// </summary>
        /// <param name="notification"></param>
        /// <returns></returns>
        [HttpDelete("/deleteNotification")]
        public async Task<IActionResult> DeleteNotification(string notificationId, CancellationToken token = default)
        {
            try
            {
                await mongoWork.DeleteNotification(notificationId, token);
                return Ok("Done");
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Deletes all current active notifications for User
        /// </summary>
        /// <param name="userId">User's Id</param>
        /// <returns></returns>
        [HttpDelete("/clearAllNotifications")]
        public async Task<IActionResult> ClearAllNotifications(string userId, CancellationToken token = default)
        {
            try
            {
                await mongoWork.DeleteAllNotificationsForUser(userId, token);
                return Ok("Done");
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }
    }
}
