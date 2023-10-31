using TilePlanner_Server_RESTAPI.ORM;

namespace TilePlanner_Server_RESTAPI.BasicItemTransform
{
    public class CoordinateTile
    {
        public string Id { get; set; }
        public Itemtype Itemtype { get; set; } 
        public string Header { get; set; } 
        public string ParentId { get; set; } 
        public string CreatorId { get; set; } 
        public List<string>? Tags { get; set; } = null;
        public double TileSizeX { get; set; } = 0; 
        public double TileSizeY { get; set; } = 0; 
        public double TilePosX { get; set; } = 0; 
        public double TilePosY { get; set; } = 0; 
        public List<Coordinate>? Coordinates { get; set; } = null; 

    }
}
