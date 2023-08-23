﻿using MongoDB.Bson.Serialization.Attributes;

namespace TilePlanner_Server_RESTAPI.ORM
{
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

        public bool IsDeleted { get; set; } = false;
    }
}