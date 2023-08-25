using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;

namespace TilePlanner_Server_RESTAPI.Controllers
{
    [Route("api/auth/tst")]
    [ApiController]
    public class Authorization : ControllerBase
    {
        private MongoWork MongoWork;

        public Authorization(MongoWork mongoWork)
        {
            this.MongoWork = mongoWork;
        }

        [HttpPost("/login")]
        [Produces("application/json")]
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
        public async Task<IActionResult> RegisterTest(User user)
        {
            try
            {
                if (String.IsNullOrEmpty(user.Id))
                {
                    user.Id = ObjectId.GenerateNewId().ToString();
                }
                
                return Ok(await MongoWork.addNewUser(user));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }
    }
}
