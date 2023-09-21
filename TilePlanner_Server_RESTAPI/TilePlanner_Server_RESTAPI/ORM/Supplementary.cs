using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.StaticFiles;
using TilePlanner_Server_RESTAPI.ORM.Roles;

namespace TilePlanner_Server_RESTAPI.ORM
{
    public class CoordinateDTO
    {
        public string Lat { get; set; } = string.Empty;
        public string Long { get; set; } = string.Empty;
    }

    public class FileInfoShortDTO
    {
        public string FileId { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
    }

    public class DBFileRetDTO
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

    public class LoginDataDTO
    {
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }


    public class RoleUpdateFieldsDTO
    {
        public string UserId { get; set; } = string.Empty;
        public double DaysToAdd { get; set; } = default;
        public AccessLevel AccessLevel { get; set; } = default(AccessLevel);
    }


    public class CheckoutModelDTO
    {
        public string AccessLevel { get; set; } = string.Empty;
        public decimal MoneyAmount { get; set; } = default;
        public string PaymentMethodNonce { get; set; } = string.Empty;
        public string UserID { get; set; } = string.Empty;

    }

    public class ReturnTokenDataDTO
    {
        public string Token { get; set; } = string.Empty;
        public string UserID { get; set; } = string.Empty;
    }

    class CorsFilter : ActionFilterAttribute
    {

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            context.HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
        }
    }

    public class CreateScreenDTO
    {
        public string ScreenName { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
    }

    public class BadRequestErrorDTO
    {
        public string ErrorClass { set; get; } = string.Empty;
        public string ErrorMsg { set; get; } = string.Empty;

    }
}
