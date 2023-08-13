using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Collections;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;

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
        [HttpGet("/GetCollection")]
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
        [HttpPost("/uploadFile")]
        [Produces("application/json")]
        public async Task<ActionResult<BasicItem>> UploadFile(BasicItem item)
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
        [HttpGet("/uploadFile2")]
        [Produces("application/json")]
        public async Task<ActionResult<FileInfoShort>> UploadFile2()
        {
            var testfile = new FileInfo("E:\\TEMP\\TEMP.rar");

            return await MongoWork.SaveToGridFS_Test(testfile);
        }
    }
}
