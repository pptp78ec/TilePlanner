using Braintree;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TilePlanner_Server_RESTAPI.Auth;
using TilePlanner_Server_RESTAPI.BrainTreePayPalPayment;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;
using TilePlanner_Server_RESTAPI.ORM.Roles;

namespace TilePlanner_Server_RESTAPI.Controllers
{

    /// <summary>
    /// Braintree payments API controller class
    /// </summary>
    [ApiController]
#if AUTHALT
#if AUTHALT_ENABLED
    [Authorize]
#endif
#endif
    public class BrainTreePaymentController : ControllerBase
    {
        private readonly IBrainTreeService brainTreeService;
        private readonly MongoContext mongoWork;
        private readonly Authenticate authenticate;
        public BrainTreePaymentController(IBrainTreeService brainTreeService, MongoContext mongoWork, Authenticate authenticate)
        {
            this.brainTreeService = brainTreeService;
            this.mongoWork = mongoWork;
            this.authenticate = authenticate;
        }

        /// <summary>
        /// Generates transaction token.
        /// </summary>
        /// <returns>Transaction token</returns>
        [HttpGet("/generatetoken")]
        public async Task<IActionResult> GenerateToken(CancellationToken token = default)
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

        /// <summary>
        /// Checkot. Sends data to Braintree server to confirm transaction, adds info about transaction to database
        /// </summary>
        /// <param name="checkout">CheckoutDTO model. Consists of access level, amount of money to transfer, Payment nonce, User's Id.
        /// Raises User's Role level to proveided in CheckoutDTO access level, saves trasaction data in database</param>
        /// <returns></returns>
        [HttpPost("/checkout")]
        public async Task<IActionResult> Checkout([FromForm] CheckoutModelDTO checkout, CancellationToken cancellationToken = default)
        {
            try
            {
                string newToken = string.Empty;
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
                var transactionData = new TransactionData() { MoneyAmount = checkout.MoneyAmount, UserId = checkout.UserID, AccessLevel = Enum.Parse<AccessLevel>(checkout.AccessLevel) };
                if (cancellationToken.IsCancellationRequested)
                {
                    return BadRequest("Cancelled!");
                }
                Result<Transaction> result = await gateway.Transaction.SaleAsync(request);
                if (result.IsSuccess())
                {
                    newToken = "Your payment is Successful!";
                    transactionData.IsSuccessful = true;
                    await mongoWork.AddTransactionData(transactionData, token: cancellationToken);
                    await mongoWork.UpdateSupbscription(transactionData.UserId, transactionData.AccessLevel, 30, token: cancellationToken);
                    newToken = (await authenticate.AuthenticateThis(await mongoWork.FindUserById(transactionData.UserId, cancellationToken))).Token;
                }
                else
                {
                    string errorMsg = string.Empty;
                    foreach (var error in result.Errors.DeepAll())
                    {
                        errorMsg += "Error: " + (int)error.Code + " - " + error.Message + "\n";
                    }
                    transactionData.IsSuccessful = false;
                    transactionData.ErrorMSG = errorMsg;
                    await mongoWork.AddTransactionData(transactionData, cancellationToken);
                    return Problem(errorMsg, null, 424);
                }
                return Ok(newToken);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }
    }
}
