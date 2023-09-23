using Braintree;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Collections;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;
using TilePlanner_Server_RESTAPI.ORM.Roles;

namespace TilePlanner_Server_RESTAPI.Controllers
{
    [Route("api")]
    [ApiController]
    public class ItemCRUDcontroller : ControllerBase
    {
        private MongoWork MongoWork;

        public ItemCRUDcontroller(MongoWork MongoWork)
        {
            this.MongoWork = MongoWork;
        }

        /// <summary>
        /// FOR TESTING PURPOSES
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet("/getcollectiontest")]
        [Produces("application/json")]
        public ICollection GetItems()
        {
            var result = MongoWork.Test();


            return result;
        }

        /// <summary>
        /// Endpoint for saving file in gridFS
        /// </summary>
        /// <param name="item">Item</param>
        /// <returns>Item with fileinfo</returns>

#if GRIDFS      
        [HttpPost("/uploadfile")]
        [Produces("application/json")]
#if AUTHALT
#if AUTHALT_ENABLED
        [Authorize(Roles = "ADVANCED,FULL")]
#endif
#endif
        public async Task<ActionResult<BasicItem>> UploadFile([FromBody] BasicItem item)
        {
            var request = HttpContext.Request;
            var file = HttpContext.Request.Form.Files[0];
            var fileinfoshort = await MongoWork.SaveFileToGridFS(file);
            var fileitem = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), Itemtype = Itemtype.FILE, CreatorId = item.CreatorId, Header = item.Header, ParentId = item.ParentId, Tags = item.Tags, File = fileinfoshort, Description = item.Description };
            await MongoWork.addOneitem(fileitem);
            return fileitem;
        }

        /// <summary>
        /// TEST for file save in DB
        /// </summary>
        /// <returns></returns>
        [HttpGet("/uploadfile2")]
        [Produces("application/json")]
#if AUTHALT
#if AUTHALT_ENABLED
        [Authorize(Roles = "ADVANCED,FULL")]
#endif
#endif
        public async Task<ActionResult<FileInfoShort>> UploadFile2()
        {
            var testfile = new FileInfo("E:\\TEMP\\TEMP.rar");

            return await MongoWork.SaveToGridFS_Test(testfile);
        }


        /// <summary>
        /// Gets file from DB and returns it
        /// </summary>
        /// <param name="fileId">Id of a file</param>
        /// <returns></returns>
        [HttpPost("/getfile")]
#if AUTHALT
#if AUTHALT_ENABLED
        [Authorize(Roles = "ADVANCED,FULL")]
#endif
#endif
        public async Task<IActionResult> getFile(string fileId)
        {

            try
            {
                var retFile = await MongoWork.LoadFromGridFs(ObjectId.Parse(fileId));
                if (retFile != null)
                {
                    return Ok(File(retFile.FileContents, retFile.getContentType(), retFile.FileName));
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
        /// Gets all screens for a specific user
        /// </summary>
        /// <param name="userId">User id</param>
        /// <returns></returns>
        [HttpPost("/getuserscreens")]
        [Produces("application/json")]
#if AUTHALT
#if AUTHALT_ENABLED
        [Authorize]
#endif
#endif
        public async Task<ActionResult<List<BasicItem>>> GetScreens(string userId)
        {
            try
            {
                return Ok(await MongoWork.GetListOfScreensForUser(userId));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        [HttpPost("/createproject")]
        [Produces("application/json")]
#if AUTHALT
#if AUTHALT_ENABLED
        [Authorize]
#endif
#endif
        public async Task<IActionResult> CreateProjectScreen([FromBody] CreateScreenDTO screenDTO) 
        {
            try
            {
                var screen = new BasicItem() {
                    Id = ObjectId.GenerateNewId().ToString(),
                    Itemtype = Itemtype.SCREEN,
                    CreatorId = screenDTO.UserId,
                    Header = screenDTO.ScreenName
                };

                await MongoWork.AddOrUpdateItems((new BasicItem[] { screen }).ToList());

                return Ok(screen);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }


        /// <summary>
        /// Returns screen with it's children (tabs, tiles, tile items)
        /// </summary>
        /// <param name="item">BasicItem item</param>
        /// <returns></returns>
        [HttpPost("/gettiles")]
        [Produces("application/json")]
#if AUTHALT
#if AUTHALT_ENABLED
        [Authorize]
#endif
#endif
        public async Task<ActionResult<List<BasicItem>>> getScreen([FromBody] BasicItem item)
        {
            try
            {
                return Ok(await MongoWork.GetListOfScreenChildren(item.Id));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Deletes item from DB 
        /// </summary>
        /// <param name="item">BasicItem item</param>
        /// <returns></returns>
        [HttpPost("/deleteitem")]
        [Produces("application/json")]
#if AUTHALT
#if AUTHALT_ENABLED
        [Authorize]
#endif
#endif
        public async Task<IActionResult> deleteItem([FromBody] BasicItem item)
        {
            try
            {
                await MongoWork.DeleteListOfChildren(item.Id);
                return Ok(item);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Updates items in DB
        /// </summary>
        /// <param name="items">List of items currently shown on screen</param>
        /// <returns></returns>
        [HttpPost("/updateitems")]
        [Produces("application/json")]
#if AUTHALT
#if AUTHALT_ENABLED
        [Authorize]
#endif
#endif
        public async Task<IActionResult> updateItems([FromBody] List<BasicItem> items)
        {
            try
            {
#if AUTHALT
#if AUTHALT_ENABLED
                //check if limit of 500 is exceeded
                if(items.Count > 0)
                {
                    var currentItemCount = await MongoWork.CountAllItemsForUserId(items[0].ParentId);
                    var role = await MongoWork.FindRoleByUserId(items[0].ParentId);
                    if ((currentItemCount + items.Count) > 1000 && role.AccessLevel == AccessLevel.BASIC)
                    {
                        return BadRequest("Exceeded number of items at this access level");
                    }

                    
                }
#endif
#endif
                await MongoWork.AddOrUpdateItems(items);
            return Ok();
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

    }
}
