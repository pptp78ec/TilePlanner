using MongoDB.Bson.Serialization.Attributes;

namespace TilePlanner_Server_RESTAPI.ORM
{
    public class Notification
    {
        [BsonId]
        public string Id { get; set; } = string.Empty;
        public DateTime NotificationTime { get; set; } = DateTime.MinValue;
        public string Header { get; set; } = string.Empty;
        public bool IsDone { get; set; } = false;
        public string UserId { get; set; } = string.Empty;
    }
}
