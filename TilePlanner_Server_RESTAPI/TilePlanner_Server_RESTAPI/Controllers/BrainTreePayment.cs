using Braintree;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TilePlanner_Server_RESTAPI.BrainTreePayPalPayment;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;
using TilePlanner_Server_RESTAPI.ORM.Roles;

namespace TilePlanner_Server_RESTAPI.Controllers
{
    [Route("api/brpayment")]
    [ApiController]
#if AUTHALT
#if AUTHALT_ENABLED
    [Authorize]
#endif
#endif
    public class BrainTreePayment : ControllerBase
    {
        private readonly IBrainTreeService brainTreeService;
        private readonly MongoWork mongoWork;
        public BrainTreePayment(IBrainTreeService brainTreeService, MongoWork mongoWork)
        {
            this.brainTreeService = brainTreeService;
            this.mongoWork = mongoWork;
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
        public async Task<IActionResult> Checkout([FromForm]CheckoutModel checkout)
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
                var transactionData = new TransactionData() { MoneyAmount = checkout.MoneyAmount, UserId = checkout.UserID, AccessLevel = Enum.Parse<AccessLevel>(checkout.AccessLevel)};
                Result<Transaction> result = await gateway.Transaction.SaleAsync(request);

                if (result.IsSuccess())
                {
                    paymentStatus = "Your payment is Successful!";
                    transactionData.IsSuccessful = true;
                    await mongoWork.addTransactionData(transactionData);
                }
                else
                {
                    string errorMsg = string.Empty;
                    foreach(var error in result.Errors.DeepAll()) {

                        errorMsg += "Error: " + (int)error.Code + " - " + error.Message + "\n";
                    }
                    transactionData.IsSuccessful = false;
                    transactionData.ErrorMSG = errorMsg;
                    await mongoWork.addTransactionData(transactionData);
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
