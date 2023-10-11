using Braintree;

namespace TilePlanner_Server_RESTAPI.BrainTreePayPalPayment
{

    /// <summary>
    /// Braintree service class.
    /// </summary>
    public class BrainTreeService : IBrainTreeService
    {
        private readonly IConfiguration config;

        public BrainTreeService(IConfiguration configuration)
        {
            config = configuration;
        }

        /// <summary>
        /// Creates Braintree gateway. Uses specified MerchantId, PublicKey, PrivateKey stored in appsettings.json. You can get them from your Braintree account
        /// </summary>
        /// <returns></returns>
        public async Task<IBraintreeGateway> CreateGatewayAsync()
        {
            return await Task.Run(() =>
            {
                return new
                BraintreeGateway()
                {
                    Environment = Braintree.Environment.SANDBOX,
                    MerchantId = config.GetValue<string>("BraintreeGateway:MerchantId"),
                    PublicKey = config.GetValue<string>("BraintreeGateway:PublicKey"),
                    PrivateKey = config.GetValue<string>("BraintreeGateway:PrivateKey")
                };
            });
        }

        /// <summary>
        /// Returns BraintreeGateway
        /// </summary>
        /// <returns></returns>
        public async Task<IBraintreeGateway> GetGatewayAsync()
        {
            return await CreateGatewayAsync();
        }
    }
}
