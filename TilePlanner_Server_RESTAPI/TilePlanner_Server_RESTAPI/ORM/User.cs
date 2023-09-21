using System.Diagnostics.CodeAnalysis;

namespace TilePlanner_Server_RESTAPI.ORM
{
    public class User
    {
        [MongoDB.Bson.Serialization.Attributes.BsonId]
        
        public string Id { get; set; } = string.Empty;
        [AllowNull]
        public string Login { get; set; } = string.Empty;
        [AllowNull]
        public string Password { get; set; } = string.Empty;
        [AllowNull]
        public string Name { get; set; } = string.Empty;
        [AllowNull]
        public string Description { get; set; } = string.Empty;
        [AllowNull]
        public string Email { get; set; } = string.Empty;
        [AllowNull]
        public string Phone { get; set; } = string.Empty;
        [AllowNull]
        public DateTime RegisterDate { get; set; } = DateTime.MinValue;
        [AllowNull]
        public string UserImageId { get; set; } = string.Empty;
        [AllowNull]
        public bool IsDeleted { get; set; } = false;
    }
}
