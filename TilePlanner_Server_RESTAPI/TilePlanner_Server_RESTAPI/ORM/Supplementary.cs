using MongoDB.Driver.Core.Clusters.ServerSelectors;

namespace TilePlanner_Server_RESTAPI.ORM
{
    public class Coordinate
    {
        public string Lat { get; set; } = string.Empty;
        public string Long { get; set; } = string.Empty;
    }

    public class FileInfoShort
    {
        public string FileId { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
    }
}
