using Microsoft.AspNetCore.StaticFiles;
using TilePlanner_Server_RESTAPI.ORM.Roles;

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

    public class RoleUpdateFields
    {
        public string UserId { get; set; }
        public double DaysToAdd { get; set; }
        public AccessLevel AccessLevel { get; set; }
    }
}
