using Braintree;

namespace TilePlanner_Server_RESTAPI.BrainTreePayPalPayment
{

    /// <summary>
    /// Braiuntree service intreface. 
    /// </summary>
    public interface IBrainTreeService
    {
        public Task<IBraintreeGateway> CreateGatewayAsync();
        public Task<IBraintreeGateway> GetGatewayAsync();
    }
}
