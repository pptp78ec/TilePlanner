using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TilePlanner_Server_RESTAPI.BrainTreePayPalPayment;
using TilePlanner_Server_RESTAPI.DBConnection;

namespace TilePlanner_Server_RESTAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrainTreePayment : ControllerBase
    {
        private readonly IBrainTreeService brainTreeService;
        public BrainTreePayment(IBrainTreeService brainTreeService)
        {
            this.brainTreeService = brainTreeService;
        }

        [HttpGet("/generatetoken")]
        public async Task<IActionResult> GenerateToken()
        {
            try
            {
                var gateway = await brainTreeService.GetGatewayAsync();
                return Ok(await gateway.ClientToken.GenerateAsync());
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }


    }
}
