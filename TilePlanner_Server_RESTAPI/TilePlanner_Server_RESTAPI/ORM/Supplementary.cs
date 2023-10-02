using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.StaticFiles;
using TilePlanner_Server_RESTAPI.ORM.Roles;

namespace TilePlanner_Server_RESTAPI.ORM
{
    //------------------------------------------------------------------------------------------
    //List of all DTO/DAO supplementary classes
    //------------------------------------------------------------------------------------------


    /// <summary>
    /// Class for storing coordinate values in BasicItem class
    /// </summary>
    public class CoordinateDAO
    {
        public string Lat { get; set; } = string.Empty;
        public string Long { get; set; } = string.Empty;
    }


    /// <summary>
    /// Class for storing short info about file in BasicItem class
    /// </summary>
    public class FileInfoShortDAO
    {
        public string FileId { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
    }

    /// <summary>
    /// Class to get file from database. Returns filename and file byte array
    /// </summary>

    public class DBFileRetDAO
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

    /// <summary>
    /// Class to accept login data (either login, email or phone number) and password from user during login
    /// </summary>

    public class LoginDataDTO
    {
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }


    /// <summary>
    /// Class to accept Checkout data from Braintree frontend logic
    /// </summary>

    public class CheckoutModelDTO
    {
        public string AccessLevel { get; set; } = string.Empty;
        public decimal MoneyAmount { get; set; } = default;
        public string PaymentMethodNonce { get; set; } = string.Empty;
        public string UserID { get; set; } = string.Empty;

    }

    /// <summary>
    /// Class to return JWT token to user
    /// </summary>

    public class ReturnTokenDataDTO
    {
        public string Token { get; set; } = string.Empty;
        public string UserID { get; set; } = string.Empty;
    }

#if DEBUG
    /// <summary>
    /// For developeing purposes. Filter to add CORS header to all outbound requests from this server.
    /// </summary>

    class CorsFilter : ActionFilterAttribute
    {

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            context.HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
        }
    }
#endif

    /// <summary>
    /// Class with minimum data necessary to create a Screen/Project
    /// </summary>

    public class CreateScreenDTO
    {
        public string ScreenName { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
    }

    /// <summary>
    /// Class to classify and return error info. Asked by frontend devs
    /// </summary>

    public class BadRequestErrorDTO
    {
        public string ErrorClass { set; get; } = string.Empty;
        public string ErrorMsg { set; get; } = string.Empty;

    }
}
