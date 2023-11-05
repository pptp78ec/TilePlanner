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
        public string Id { get; set; } = string.Empty; //* ALL
        [JsonConverter(typeof(StringEnumConverter))]
        [BsonRepresentation(MongoDB.Bson.BsonType.String)]
        public Itemtype Itemtype { get; set; } = Itemtype.DEFAULT; //* ALL
        public string Header { get; set; } = string.Empty; //* for ITEMTYPE.SCREEN, ITEMTYPE.TILE, ITEMTYPE.TEXT
        public string Description { get; set; } = string.Empty; //* FOR DESCRIPTION, ALSO TO SAVE ITEMTYPE.NOTES TEXT
        public string ParentId { get; set; } = string.Empty; //* ALL but SCREEN
        public string CreatorId { get; set; } = string.Empty; //* ALL
        [BsonIgnoreIfNull]
        public List<string>? Tags { get; set; } = null;
        public double TileSizeX { get; set; } = 0; //* ALL BUT ITEMTYPE.COORDINATE
        public double TileSizeY { get; set; } = 0; //* ALL BUT ITEMTYPE.COORDINATE
        public double TilePosX { get; set; } = 0; //* ALL BUT ITEMTYPE.COORDINATE
        public double TilePosY { get; set; } = 0; //* ALL BUT ITEMTYPE.COORDINATE
        public string BackgroundColor { get; set; } = string.Empty;
        public string BackgroundImageId { get; set; } = string.Empty;
        [BsonIgnoreIfNull]
        public DateTime? TaskSetDate { get; set; } = null; //* FOR ITEMTYPE.TASK
        [BsonIgnoreIfNull]
        public List<Coordinate>? Coordinates { get; set; } = null; //* FOR ITEMTYPE.COORDINATE
        [BsonIgnoreIfNull]
        public FileInfoShort? File { get; set; } = null; //* FOR ITEMTYPE.IMAGE FOR ITEMTYPE.FILE
        public bool isDone { get; set; } = false; //* FOR ITEMTYPE.TASK
        [BsonIgnoreIfNull]
        public List<BudgetItem>? BudgetItems { get; set; } = null; //FOR a ITEMTYPE.BUDGET TILE
#if DELETION_ALT
        public bool isDeleted { get; set; } = false;
#endif
    }
}
