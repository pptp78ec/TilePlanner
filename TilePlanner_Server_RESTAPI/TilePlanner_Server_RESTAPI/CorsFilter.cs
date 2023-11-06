using Microsoft.AspNetCore.Mvc.Filters;

namespace TilePlanner_Server_RESTAPI
{
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
}
