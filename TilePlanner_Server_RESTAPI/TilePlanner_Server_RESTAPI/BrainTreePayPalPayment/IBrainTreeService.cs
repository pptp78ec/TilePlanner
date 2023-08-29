using Braintree;

namespace TilePlanner_Server_RESTAPI.BrainTreePayPalPayment
{
    public interface IBrainTreeService
    {
        public Task<IBraintreeGateway> CreateGatewayAsync();
        public Task<IBraintreeGateway> GetGatewayAsync();
    }
}
