using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
                var user = await mongoWork.findUserById(id);
                if(user != default)
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
        public async Task<IActionResult> updateUserAllFields(User user)
        {
            try
            {
                await mongoWork.updateUserPassword(user);
                await mongoWork.updateUserName(user);
                await mongoWork.updateUserPhone(user);
                await mongoWork.updateUserImageId(user);
                await mongoWork.updateUserEmail(user);
                await mongoWork.updateUserDescription(user);

                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }


        [HttpPost("/updateUserName")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserName(User user)
        {
            try
            {
                await mongoWork.updateUserName(user);
                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }


        [HttpPost("/updateUserPassword")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserPassword(User user)
        {
            try
            {
                await mongoWork.updateUserPassword(user);
                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        [HttpPost("/updateUserImage")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserImage(User user)
        {
            try
            {
 
                await mongoWork.updateUserImageId(user);

                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        [HttpPost("/updateUserEmail")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserEmail(User user)
        {
            try
            {
                await mongoWork.updateUserEmail(user);

                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        [HttpPost("/updateUserPhone")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserPhone(User user)
        {
            try
            {
                await mongoWork.updateUserPhone(user);

                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }
        [HttpPost("/updateUserDescription")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserDescription(User user)
        {
            try
            {
                await mongoWork.updateUserDescription(user);

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
