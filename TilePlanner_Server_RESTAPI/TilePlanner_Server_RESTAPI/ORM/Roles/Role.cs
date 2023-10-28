using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace TilePlanner_Server_RESTAPI.ORM.Roles
{

    /// <summary>
    /// A class for user role. Has AccessLevel enum to provide data about access restrictions
    /// </summary>
    public class Role
    {
        [BsonId]
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        [JsonConverter(typeof(StringEnumConverter))]
        [BsonRepresentation(MongoDB.Bson.BsonType.String)]
        public AccessLevel AccessLevel { get; set; }
        [BsonIgnoreIfNull]
        public DateTime? EndTime { get; set; }

    }

}
