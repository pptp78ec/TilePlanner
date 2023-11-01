using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Collections;
using TilePlanner_Server_RESTAPI.DBConnection;
using TilePlanner_Server_RESTAPI.ORM;
using TilePlanner_Server_RESTAPI.ORM.Roles;

namespace TilePlanner_Server_RESTAPI.Controllers
{
    /// <summary>
    /// Items API controller
    /// </summary>
    [ApiController]
#if AUTHALT
#if AUTHALT_ENABLED
    [Authorize]
#endif
#endif
    public class ItemCRUDcontroller : ControllerBase
    {
        private MongoContext MongoWork;

        public ItemCRUDcontroller(MongoContext MongoWork)
        {
            this.MongoWork = MongoWork;
        }

#if DEBUG
        /// <summary>
        /// FOR TESTING PURPOSES ONLY. CREATES 
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
#endif

        /// <summary>
        /// Gets all screens for a specific user
        /// </summary>
        /// <param name="userId">User id</param>
        /// <returns></returns>
        [HttpPost("/getuserscreens")]
        [Produces("application/json")]
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

        /// <summary>
        /// Creates a screen/project and writes it in database
        /// </summary>
        /// <param name="screenDTO">Screen DTO. Consists of screen name and UserId that creates it</param>
        /// <returns></returns>
        [HttpPost("/createproject")]
        [Produces("application/json")]
        public async Task<IActionResult> CreateProjectScreen([FromBody] CreateScreenDTO screenDTO)
        {
            try
            {
                var screen = new BasicItem()
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    Itemtype = Itemtype.SCREEN,
                    CreatorId = screenDTO.UserId,
                    Header = screenDTO.ScreenName
                };
                var coordinateTile = new BasicItem()
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    Itemtype = Itemtype.COORDINATE,
                    CreatorId = screenDTO.UserId,
                    Coordinates = new List<CoordinateDAO>(),
                    ParentId = screen.Id
                };
                await MongoWork.AddOrUpdateItems((new BasicItem[] { screen, coordinateTile }).ToList());
                return Ok(screen);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Returns children for a screen (tabs, tiles, tile items)
        /// </summary>
        /// <param name="item">BasicItem item</param>
        /// <returns></returns>
        [HttpGet("/gettilesAndRecords")]
        [Produces("application/json")]
        public async Task<ActionResult<List<BasicItem>>> getTilesAndRecords(string parentTileId)
        {
            try
            {
                return Ok(await MongoWork.GetListOfChildren(parentTileId));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Returns tiles (AND ONLY TILES, w/o records in these tiles) for a specified screen Id
        /// </summary>
        /// <param name="parentScreenId">Id of a screen</param>
        /// <returns></returns>
        [HttpGet("/getTilesForScreen")]
        [Produces("application/json")]
        public async Task<IActionResult> getTilesForScreen(string parentScreenId)
        {
            try
            {
                var listOfTiles = await MongoWork.GetListOfChildernOfSpecificType(parentScreenId, Itemtype.TILE);
                listOfTiles.AddRange(await MongoWork.GetListOfChildernOfSpecificType(parentScreenId, Itemtype.NOTES));
                listOfTiles.AddRange(await MongoWork.GetListOfChildernOfSpecificType(parentScreenId, Itemtype.BUDGET));
                listOfTiles.AddRange(await MongoWork.GetListOfChildernOfSpecificType(parentScreenId, Itemtype.IMAGE));
                listOfTiles.AddRange(await MongoWork.GetListOfChildernOfSpecificType(parentScreenId, Itemtype.TASKLIST));
                return Ok(listOfTiles);
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }

        /// <summary>
        /// Returns coordinate tile for specified SCREEN (project)
        /// </summary>
        /// <param name="parentScreenId">Id of a screen</param>
        /// <returns></returns>
        [HttpGet("/getCoordinateTile")]
        [Produces("application/json")]
        public async Task<IActionResult> getCoordinateTile(string parentScreenId)
        {
            try
            {
                return Ok(await MongoWork.GetListOfChildernOfSpecificType(parentScreenId, Itemtype.COORDINATE));
            }
            catch (Exception e)
            {
                return Problem(detail: e.StackTrace, title: e.Message, statusCode: 500);
            }
        }



        /// <summary>
        /// Returns records for specified tile
        /// </summary>
        /// <param name="parentTileId">Id of a tile</param>
        /// <returns></returns>
        [HttpGet("/getRecordsForTile")]
        [Produces("application/json")]
        public async Task<IActionResult> getRecordsForTile(string parentTileId)
        {
            try
            {
                return Ok(await MongoWork.GetListOfChildren(parentTileId));
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
        [HttpDelete("/deleteitem")]
        [Produces("application/json")]
        public async Task<IActionResult> deleteItem(string itemId)
        {
            try
            {
                await MongoWork.DeleteListOfChildren(itemId);
                return Ok("Deleted!");
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
        public async Task<IActionResult> updateItems([FromBody] List<BasicItem> items)
        {
            try
            {
#if AUTHALT
#if AUTHALT_ENABLED
                //check if limit of 1000 is exceeded
                if (items.Count > 0)
                {
                    var currentItemCount = await MongoWork.CountAllItemsForUserId(items[0].ParentId);
                    var role = await MongoWork.FindRoleByUserId(items[0].CreatorId);
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
