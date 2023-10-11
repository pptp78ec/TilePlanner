using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace TilePlanner_Server_RESTAPI.ORM
{

    /// <summary>
    /// Universal class model for item, be it Project(Screen), Tab, Tile etc
    /// </summary>
    public class BasicItem
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        [JsonConverter(typeof(StringEnumConverter))]
        [BsonRepresentation(MongoDB.Bson.BsonType.String)]
        public Itemtype Itemtype { get; set; } = Itemtype.DEFAULT;
        public string Header { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ParentId { get; set; } = string.Empty;
        public string CreatorId { get; set; } = string.Empty;
        [BsonIgnoreIfNull]
        public List<string>? Tags { get; set; } = null;
        public double TileSizeX { get; set; } = 0;
        public double TileSizeY { get; set; } = 0;
        public double TilePosX { get; set; } = 0;
        public double TilePosY { get; set; } = 0;
        public string BackgroundColor { get; set; } = string.Empty;
        public string BackgroundImageId { get; set; } = string.Empty;
        [BsonIgnoreIfNull]
        public DateTime? TaskSetDate { get; set; } = null;
        [BsonIgnoreIfNull]
        public List<CoordinateDAO>? Coordinates { get; set; } = null;
        [BsonIgnoreIfNull]
        public FileInfoShortDAO? File { get; set; } = null;
        public bool isDone { get; set; } = false;
    }
}
