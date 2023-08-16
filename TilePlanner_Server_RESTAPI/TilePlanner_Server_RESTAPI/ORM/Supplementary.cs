using Microsoft.AspNetCore.StaticFiles;

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

    public class DBFileRet
    {
        public string FileName { get; set; }
        public Stream FileStream { get; set; }

        public string getContentType()
        {
            string contentType;
            new FileExtensionContentTypeProvider().TryGetContentType(FileName, out contentType);
            return contentType ?? "application/octet-stream";
        }
    }
}
