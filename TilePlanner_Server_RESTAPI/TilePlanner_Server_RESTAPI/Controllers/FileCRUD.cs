using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TilePlanner_Server_RESTAPI.Auth;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;

namespace TilePlanner_Server_RESTAPI.Controllers
{

    [Route("api")]
    [ApiController]
#if AUTHALT
#if AUTHALT_ENABLED
    [Authorize]
#endif
#endif

    public class FileCRUD : ControllerBase
    {
        private readonly IConfiguration configuration;

        public FileCRUD(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        [HttpGet("/getfile/{userId}/{filename}")]
        public async Task<IActionResult> GetFile(string userId, string filename)
        {
            return await DownloadFile(userId, filename);
        }

        [HttpGet("/getimage/{userId}/{filename}")]
        public async Task<IActionResult> GetImage(string userId, string filename)
        {
            return await DownloadFile(userId, filename, true);
        }

        [HttpPost("/loadfile/{userId}")]
        public async Task<IActionResult> UploadFile(string userId, IFormFile file)
        {
            return await SaveFile(userId, file);
        }

        [HttpPost("/loadimage/{userId}")]
        public async Task<IActionResult> UploadImage(string userId, IFormFile file)
        {
            return await SaveFile(userId, file, true);
        }

        [NonAction]
        public async Task<IActionResult> SaveFile(string userId, IFormFile file, bool isImage = false)
        {

            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("Invalid file");
                }

                var path = configuration.GetValue<string>("StorageFolder");

                path = Path.Combine(path, userId, isImage?"images":"files");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                var filename = Guid.NewGuid().ToString() + "-" + file.FileName;
                var filePath = Path.Combine(path, filename);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Ok(filename);

            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }

           
        }

        [NonAction]
        public async Task<IActionResult> DownloadFile(string userId, string filename, bool isImage = false)
        {
            try
            {
                var path = configuration.GetValue<string>("StorageFolder");

                var filePath = Path.Combine(path, userId, isImage ? "images" : "files", filename);

                var filetype = filename.Split('.').Last();

                var contentType = "application/octet-stream";
                
                switch (filetype)
                {
                    case "webp" : { contentType = "image/webp"; break; };
                    case "jpg": 
                    case "jpeg": { contentType = "image/jpeg"; break; };
                    case "png": { contentType = "image/png"; break; };
                    case "svg": { contentType = "image/svg+xml"; break; }
                    case "gif": { contentType = "image/gif"; break; }
                    default: break;
                }


                if(!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }

                var filebyts =  await System.IO.File.ReadAllBytesAsync(filePath);

                if(isImage)
                {
                    Response.Headers.Add("Content-Type", contentType);
                    return File(filebyts, contentType);
                }

                return File(filebyts, contentType, filename);

            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

    }
}
