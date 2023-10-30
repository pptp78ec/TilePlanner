using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using TilePlanner_Server_RESTAPI.Auth;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;

namespace TilePlanner_Server_RESTAPI.Controllers
{
    /// <summary>
    /// User CRUD operations API controller
    /// </summary>
    [ApiController]
#if AUTHALT
#if AUTHALT_ENABLED
    [Authorize]
#endif
#endif
    public class UserCRUDController : ControllerBase
    {
        private readonly MongoContext mongoWork;
        private readonly Authenticate authenticate;

        public UserCRUDController(MongoContext mongoContext, Authenticate authenticate)
        {
            mongoWork = mongoContext;
            this.authenticate = authenticate;
        }

        /// <summary>
        /// Gets user by specified Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
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

        /// <summary>
        /// Updates all fields for user.
        /// </summary>
        /// <param name="user">User object</param>
        /// <returns></returns>
        [HttpPost("/updateUserAllFields")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserAllFields([FromBody] User user)
        {
            try
            {
                if (await authenticate.checkIfUserIsValidToEditAsync(user.Id, this))
                {
                    return BadRequest("User's own Id and specified id doesn't match! Users can't edit another's values!");
                }

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
                await mongoWork.SetGoogleUser(user);
                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Updates only username
        /// </summary>
        /// <param name="user">User object</param>
        /// <returns></returns>
        [HttpPost("/updateUserName")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserName([FromBody] User user)
        {
            try
            {
                if (await authenticate.checkIfUserIsValidToEditAsync(user.Id, this))
                {
                    return BadRequest("User's own Id and specified id doesn't match! Users can't edit another's values!");
                }
                await mongoWork.UpdateUserName(user);
                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Updates only password
        /// </summary>
        /// <param name="user">User object</param>
        /// <returns></returns>
        [HttpPost("/updateUserPassword")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserPassword([FromBody] User user)
        {
            try
            {
                if (await authenticate.checkIfUserIsValidToEditAsync(user.Id, this))
                {
                    return BadRequest("User's own Id and specified id doesn't match! Users can't edit another's values!");
                }
                await mongoWork.UpdateUserPassword(user);
                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Updates user's image id/name. 
        /// </summary>
        /// <param name="user">User object</param>
        /// <returns></returns>
        [HttpPost("/updateUserImage")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserImage([FromBody] User user)
        {
            try
            {
                if (await authenticate.checkIfUserIsValidToEditAsync(user.Id, this))
                {
                    return BadRequest("User's own Id and specified id doesn't match! Users can't edit another's values!");
                }
                await mongoWork.UpdateUserImageId(user);
                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Updates user's email
        /// </summary>
        /// <param name="user">User object</param>
        /// <returns></returns>
        [HttpPost("/updateUserEmail")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserEmail([FromBody] User user)
        {
            try
            {
                if (await authenticate.checkIfUserIsValidToEditAsync(user.Id, this))
                {
                    return BadRequest("User's own Id and specified id doesn't match! Users can't edit another's values!");
                }
                await mongoWork.UpdateUserEmail(user);
                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Updates user's phone
        /// </summary>
        /// <param name="user">User object</param>
        /// <returns></returns>
        [HttpPost("/updateUserPhone")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserPhone([FromBody] User user)
        {
            try
            {
                if (await authenticate.checkIfUserIsValidToEditAsync(user.Id, this))
                {
                    return BadRequest("User's own Id and specified id doesn't match! Users can't edit another's values!");
                }
                await mongoWork.UpdateUserPhone(user);
                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Updates user's description
        /// </summary>
        /// <param name="user">User's object</param>
        /// <returns></returns>
        [HttpPost("/updateUserDescription")]
        [Produces("application/json")]
        public async Task<IActionResult> updateUserDescription([FromBody] User user)
        {
            try
            {
                if (await authenticate.checkIfUserIsValidToEditAsync(user.Id, this))
                {
                    return BadRequest("User's own Id and specified id doesn't match! Users can't edit another's values!");
                }
                await mongoWork.UpdateUserDescription(user);
                return Ok(user);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Get all transactions for specified user
        /// </summary>
        /// <param name="userId">User's Id</param>
        /// <returns></returns>
        [HttpGet("/getUserTransactions")]
        [Produces("application/json")]
        public async Task<IActionResult> getUserTransactions(string userId)
        {
            try
            {
                if (!(await authenticate.checkIfUserIsValidToEditAsync(userId, this))) 
                {
                    return BadRequest("User's own Id and specified id doesn't match! Users can't edit another's values!");
                }
                return Ok(await mongoWork.GetTransactionsForUserAsync(userId));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        
    }
}
