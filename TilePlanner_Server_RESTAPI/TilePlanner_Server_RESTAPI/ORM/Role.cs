using MongoDB.Bson.Serialization.Attributes;

namespace TilePlanner_Server_RESTAPI.ORM
{
    public class Role
    {
        [BsonId]
        public int Id { get; set; }

        public Roletype Roletype { get; set; }

    }
}
