using MongoDB.Bson.Serialization.Attributes;

namespace TilePlanner_Server_RESTAPI.ORM.Roles
{
    public class Role
    {
        [BsonId]
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public AccessLevel AccessLevel { get; set; }

        [BsonIgnoreIfNull]
        public DateTime? EndTime { get; set; }

    }

}
