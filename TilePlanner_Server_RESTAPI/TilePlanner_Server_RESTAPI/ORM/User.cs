namespace TilePlanner_Server_RESTAPI.ORM
{

    /// <summary>
    /// Model class to store user data
    /// </summary>
    public class User
    {
        [MongoDB.Bson.Serialization.Attributes.BsonId]
        public string Id { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime RegisterDate { get; set; } = DateTime.MinValue;
        public string UserImageId { get; set; } = string.Empty;
        public bool IsGoogle { get; set; } = false;
        public bool IsDeleted { get; set; } = false;
    }
}
