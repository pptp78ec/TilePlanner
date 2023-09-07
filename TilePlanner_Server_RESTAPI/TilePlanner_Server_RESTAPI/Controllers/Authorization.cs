using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TilePlanner_Server_RESTAPI.Auth;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;

namespace TilePlanner_Server_RESTAPI.Controllers
{
    [Route("api/auth/tst")]
    [ApiController]
    public class Authorization : ControllerBase
    {
        private readonly MongoWork MongoWork;

#if AUTHALT
        private readonly Authenticate authenticate;

        public Authorization(MongoWork MongoWork, Authenticate authenticate)
        {
            this.authenticate = authenticate;
            this.MongoWork = MongoWork;
        }

        [HttpPost("/login")]
        [Produces("application/json")]
        [AllowAnonymous]
        public async Task<IActionResult> LoginTest(LoginData logindata)
        {
            try
            {
                var user = await MongoWork.findUserBySearchParams(logindata.Login, logindata.Password);
                return user == default(User) ? BadRequest("No items found") : Ok(await authenticate.AuthenticateThis(user));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        [HttpPost("/register")]
        [Produces("application/json")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterTest(User user)
        {
            try
            {
                var newUser = await MongoWork.addNewUser(user);

                return Ok(await authenticate.AuthenticateThis(newUser));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }


#else
        public Authorization(MongoWork mongoWork)
        {
            this.MongoWork = mongoWork;
        }

        [HttpPost("/login")]
        [Produces("application/json")]
        [AllowAnonymous]
        public async Task<IActionResult> LoginTest(LoginData logindata)
        {
            try
            {
                var user = await MongoWork.findUserBySearchParams(logindata.Login, logindata.Password);

                return user == default(User) ? BadRequest("No items found") : Ok(user);


            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        [HttpPost("/register")]
        [Produces("application/json")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterTest(User user)
        {
            try
            {
                return Ok(await MongoWork.addNewUser(user));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }
#endif
    }
}

