using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;

namespace TilePlanner_Server_RESTAPI.Controllers
{
    [Route("api")]
    [ApiController]
#if AUTHALT
#if AUTHALT_ENABLED
    [Authorize]
#endif
#endif
    public class UserCRUD : ControllerBase
    {
        private readonly MongoWork mongoWork;

        public UserCRUD()
        {
            mongoWork = new MongoWork();
        }

        [HttpGet("/getuserById")]
        [Produces("application/json")]

        public async Task<IActionResult> getUserInfoById(string id)
        {
            try
            {
                var user = await mongoWork.FindUserById(id);
                if (user != default)
                {
                    return Ok(user);
                }
                return BadRequest("No user found!");

            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        [HttpPost("/updateUserAllFields")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserAllFields([FromBody] User user)
        {
            try
            {
                if (!String.IsNullOrEmpty(user.Password))
                    await mongoWork.UpdateUserPassword(user);
                if (!String.IsNullOrEmpty(user.Name))
                    await mongoWork.UpdateUserName(user);
                if (!String.IsNullOrEmpty(user.Phone))
                    await mongoWork.UpdateUserPhone(user);
                if (!String.IsNullOrEmpty(user.UserImageId))
                    await mongoWork.UpdateUserImageId(user);
                if (!String.IsNullOrEmpty(user.Email))
                    await mongoWork.UpdateUserEmail(user);
                if (!String.IsNullOrEmpty(user.Description))
                    await mongoWork.UpdateUserDescription(user);

                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }


        [HttpPost("/updateUserName")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserName([FromBody] User user)
        {
            try
            {
                await mongoWork.UpdateUserName(user);
                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }


        [HttpPost("/updateUserPassword")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserPassword([FromBody] User user)
        {
            try
            {
                await mongoWork.UpdateUserPassword(user);
                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        [HttpPost("/updateUserImage")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserImage([FromBody] User user)
        {
            try
            {

                await mongoWork.UpdateUserImageId(user);

                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        [HttpPost("/updateUserEmail")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserEmail([FromBody] User user)
        {
            try
            {
                await mongoWork.UpdateUserEmail(user);

                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        [HttpPost("/updateUserPhone")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserPhone([FromBody] User user)
        {
            try
            {
                await mongoWork.UpdateUserPhone(user);

                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }
        [HttpPost("/updateUserDescription")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserDescription([FromBody] User user)
        {
            try
            {
                await mongoWork.UpdateUserDescription(user);

                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }
        [HttpGet("/getUserTransactions")]
        [Produces("application/json")]
        public async Task<IActionResult> getUserTransactions(string userId)
        {
            try
            {
                return Ok(await mongoWork.GetTransactionsForUserAsync(userId));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }


    }
}
