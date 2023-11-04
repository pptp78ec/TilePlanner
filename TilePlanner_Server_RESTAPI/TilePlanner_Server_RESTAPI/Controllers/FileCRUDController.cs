using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic.FileIO;
using MongoDB.Bson;
using System.Runtime.InteropServices;
using TilePlanner_Server_RESTAPI.DBConnection;

namespace TilePlanner_Server_RESTAPI.Controllers
{
    /// <summary>
    /// File CRUD API controller class
    /// </summary>
    [ApiController]
#if AUTHALT
#if AUTHALT_ENABLED
    [Authorize]
#endif
#endif

    public class FileCRUDController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly MongoContext MongoWork;
        private string standardpath;

        public FileCRUDController(IConfiguration configuration, MongoContext MongoWork)
        {
            this.configuration = configuration;
            this.MongoWork = MongoWork;

            standardpath = this.configuration.GetValue<string>("StorageFolder");

            if (String.IsNullOrEmpty(standardpath))
            {
                standardpath = "$HOME/Storage";
                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                {
                    standardpath = "%APPDATA%\\Storage";
                }
                if (!Directory.Exists(standardpath))
                {
                    Directory.CreateDirectory(standardpath);
                }
            }
        }

#if GRIDFS
        /// <summary>
        /// Endpoint for saving file in gridFS
        /// </summary>
        /// <param name="item">Item</param>
        /// <returns>Item with fileinfo</returns>
        [HttpPost("/uploadfileGFS")]
        [Produces("application/json")]

        public async Task<IActionResult> UploadFileGFS(IFormFile file)
        {
            try
            {

                return Ok(await MongoWork.SaveFileToGridFS(file));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }




        /// <summary>
        /// Gets file from DB and returns it
        /// </summary>
        /// <param name="fileId">Id of a file</param>
        /// <returns></returns>
        [HttpPost("/getfileGFS/{fileId}")]

        public async Task<IActionResult> getFile(string fileId)
        {

            try
            {
                var retFile = await MongoWork.LoadFromGridFs(ObjectId.Parse(fileId));
                if (retFile != null && retFile.FileContents != null)
                {
                    var contentType = GetContenTypeForFile(retFile.getContentType());
                    if (contentType != "application/octet-stream")
                    {
                        Response.Headers.Add("Content-Type", contentType);
                        return File(retFile.FileContents, contentType);
                    }
                    return File(retFile.FileContents, contentType, retFile.FileName);
                }
                return BadRequest();

            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }
#endif

        /// <summary>
        /// Gets downloaded file
        /// </summary>
        /// <param name="userId">User's ID</param>
        /// <param name="filename">Name of saved file</param>
        /// <returns></returns>
        [HttpGet("/getfile/{userId}/{filename}")]
        public async Task<IActionResult> GetFile(string userId, string filename)
        {
            return await DownloadFile(userId, filename);
        }

        /// <summary>
        /// Get saved user's avatar image
        /// </summary>
        /// <param name="userId">User's ID</param>
        /// <param name="filename">Name of saved file</param>
        /// <returns></returns>
#if AUTHALT
#if AUTHALT_ENABLED
        [AllowAnonymous]
#endif
#endif
        [HttpGet("/avatar/{userId}/{filename}")]
        public async Task<IActionResult> GetImage(string userId, string filename)
        {
            return await DownloadFile(userId, filename, true);
        }

        /// <summary>
        /// Uploads a file
        /// </summary>
        /// <param name="userId">User's ID</param>
        /// <param name="file">File to upload</param>
        /// <returns></returns>
        [HttpPost("/loadfile/{userId}")]
        public async Task<IActionResult> UploadFile(string userId, IFormFile file)
        {
            return await SaveFile(userId, file);
        }

        /// <summary>
        /// Uploads an avatar image
        /// </summary>
        /// <param name="userId">User's ID</param>
        /// <param name="file">Image filename</param>
        /// <returns></returns>
        [HttpPost("/loadimage/{userId}")]
        public async Task<IActionResult> UploadImage(string userId, IFormFile file)
        {
            return await SaveFile(userId, file, true);
        }

        /// <summary>
        /// Saves file at specified in appsettings.json location. The path is {Your location}\{User's Id}\{Images|files}\{generated filename}
        /// </summary>
        /// <param name="userId">User's Id</param>
        /// <param name="file">File to save</param>
        /// <param name="isImage">Image/file selector. Changes path</param>
        /// <returns>Saved file's name with Guid</returns>
        [NonAction]
        public async Task<IActionResult> SaveFile(string userId, IFormFile file, bool isImage = false)
        {

            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("Invalid file");
                }


                var path = Path.Combine(standardpath, userId, isImage ? "images" : "files");

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

        /// <summary>
        ///  Downloads a file from specified in appsettings.json location. The path is {Your location}\{User's Id}\{Images|files}\{generated filename}
        /// </summary>
        /// <param name="userId">User's Id</param>
        /// <param name="filename">File's saved name name</param>
        /// <param name="isImage">Image/file selector. If set as Image, returns with necessary ContentType/</param>
        /// <returns>ActionResult with file</returns>
        [NonAction]
        public async Task<IActionResult> DownloadFile(string userId, string filename, bool isImage = false)
        {
            try
            {


                var filePath = Path.Combine(standardpath, userId, isImage ? "images" : "files", filename);
                
                var contentType = GetContenTypeForFile(filePath);


                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }

                var filebytes = await System.IO.File.ReadAllBytesAsync(filePath);

                if (isImage)
                {
                    Response.Headers.Add("Content-Type", contentType);
                    return File(filebytes, contentType);
                }

                return File(filebytes, contentType, filename);

            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        [NonAction]
        private string GetContenTypeForFile(string filename)
        {
            var contentType = "application/octet-stream";
            var filetype = filename.Split('.').Last();

            switch (filetype)
            {
                case "webp": { contentType = "image/webp"; break; };
                case "jpg":
                case "jpeg": { contentType = "image/jpeg"; break; };
                case "png": { contentType = "image/png"; break; };
                case "svg": { contentType = "image/svg+xml"; break; }
                case "gif": { contentType = "image/gif"; break; }
                default: break;
            }
            return contentType;
        }
    }
}
