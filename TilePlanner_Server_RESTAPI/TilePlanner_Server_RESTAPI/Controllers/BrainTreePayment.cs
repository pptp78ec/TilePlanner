using Braintree;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TilePlanner_Server_RESTAPI.BrainTreePayPalPayment;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;

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
        [HttpPost("/checkout")]
        public async Task<IActionResult> Checkout(CheckoutModel checkout)
        {
            try
            {
                string paymentStatus = string.Empty;
                var gateway = await brainTreeService.GetGatewayAsync();

                var request = new TransactionRequest()
                {
                    Amount = checkout.MoneyAmount,
                    PaymentMethodNonce = checkout.PaymentMethodNonce,
                    Options = new TransactionOptionsRequest()
                    {
                        SubmitForSettlement = true,
                    }
                };
                Result<Transaction> result = await gateway.Transaction.SaleAsync(request);
                if (result.IsSuccess())
                {
                    paymentStatus = "Your payment is Successful!";
                }
                else
                {
                    string errorMsg = string.Empty;
                    foreach(var error in result.Errors.DeepAll()) {

                        errorMsg += "Error: " + (int)error.Code + " - " + error.Message + "\n";
                    }
                    return Problem(errorMsg, null, 424);
                }

                return Ok(paymentStatus);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }


    }
}
