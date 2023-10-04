using MongoDB.Bson.Serialization.Attributes;
using TilePlanner_Server_RESTAPI.ORM.Roles;

namespace TilePlanner_Server_RESTAPI.ORM
{

    /// <summary>
    /// Model class to store transaction data
    /// </summary>
    public class TransactionData
    {
        [BsonId]
        public string Id { set; get; } = string.Empty;
        public string UserId { set; get; } = string.Empty;
        public decimal MoneyAmount { set; get; } = decimal.MinValue;
        public AccessLevel AccessLevel { set; get; } = default;
        public bool IsSuccessful { set; get; } = true;
        public string ErrorMSG { set; get; } = string.Empty;
    }
}
