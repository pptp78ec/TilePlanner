using MongoDB.Bson.Serialization.Attributes;

namespace TilePlanner_Server_RESTAPI.ORM
{

    /// <summary>
    /// Notification model class, used for storing data about notifications, if user chooses to create it
    /// </summary>
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
