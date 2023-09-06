using Braintree;

namespace TilePlanner_Server_RESTAPI.BrainTreePayPalPayment
{
    public class BrainTreeService : IBrainTreeService
    {
        private readonly IConfiguration config;

        public BrainTreeService(IConfiguration configuration)
        {
            config = configuration;
        }


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

        public async Task<IBraintreeGateway> GetGatewayAsync()
        {
            return await CreateGatewayAsync();
        }
    }
}
