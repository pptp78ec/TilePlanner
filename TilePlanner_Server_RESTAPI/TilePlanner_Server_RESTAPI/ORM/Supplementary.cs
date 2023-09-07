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
        public string FileName { get; set; } = string.Empty;
        public byte[]? FileContents { get; set; } = default;

        public string getContentType()
        {
            string contentType;
            new FileExtensionContentTypeProvider().TryGetContentType(FileName, out contentType);
            return contentType ?? "application/octet-stream";
        }
    }

    public class RoleUpdateFields
    {
        public string UserId { get; set; } = string.Empty;
        public double DaysToAdd { get; set; } = default;
        public AccessLevel AccessLevel { get; set; } = default(AccessLevel);
    }


    public class CheckoutModel
    {
        public string AccessLevel { get; set; } = string.Empty;
        public decimal MoneyAmount { get; set; } = default;
        public string PaymentMethodNonce { get; set; } = string.Empty;
        public string UserID { get; set; } = string.Empty;

    }

    public class ReturnTokenData
    {
        public string Token { get; set; } = string.Empty;
        public string UserID { get; set; } = string.Empty;
    }
}
