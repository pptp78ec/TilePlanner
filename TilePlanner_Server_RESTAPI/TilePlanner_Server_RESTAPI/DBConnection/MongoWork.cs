using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using Newtonsoft.Json;
using TilePlanner_Server_RESTAPI.ORM;

namespace TilePlanner_Server_RESTAPI.DBConnection
{
    public class MongoWork
    {

        private IMongoDatabase database;
        private GridFSBucket gridFSBucket;

        public MongoWork()
        {
            var builder = new ConfigurationBuilder();
            builder.AddJsonFile("appsettings.json");
            IConfiguration configuration = builder.Build();
            database = new MongoClient(configuration.GetConnectionString("MongoDBConnection")).GetDatabase(configuration.GetValue<string>("DataBaseName"));
            gridFSBucket = new GridFSBucket(database);
            if (!database.ListCollectionNames().ToList().Contains("Users"))
            {
                database.CreateCollection("Users");
                var indexOptions = new CreateIndexOptions() { Unique = true };
                var indexModel = new CreateIndexModel<User>("{ Login: 1, Email: 1, Phone: 1 }", indexOptions);
                database.GetCollection<User>("Users").Indexes.CreateOne(indexModel);
            }
            if (!database.ListCollectionNames().ToList().Contains("Users"))
                database.CreateCollection("Items");
        }

        //
        // FOR TESTING PURPOSES
        //------------------------------------------------------------------------------------------
        public List<BasicItem> Test()
        {
            var collection = database.GetCollection<BasicItem>("Items");
            // var itemtest = collection.Find("{}").ToList<IBasicItem>();
            var screen = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), Header = "Screen" };
            var tab = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), ParentId = screen.Id.ToString(), Header = "Tab" };
            var tile = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), ParentId = tab.Id.ToString(), Header = "Tile" };
            var text1 = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), ParentId = tile.Id.ToString(), Header = "Text1" };
            var text2 = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), ParentId = tile.Id.ToString(), Header = "Text2" };
            var task = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), ParentId = tile.Id.ToString(), Header = "Task" };
            collection.InsertMany(new List<BasicItem>() { screen, tab, tile, text1, text2, task });
            var coll = collection.Find("{}").ToList();
            return coll;
        }
        //------------------------------------------------------------------------------------------

        //
        //GRIDFS FILE SAVE/FILE LOAD
        //------------------------------------------------------------------------------------------

        /// <summary>
        /// Saves file into the MongoDB database using GridFS
        /// </summary>
        /// <param name="file">File from request</param>
        /// <returns>Short info about file</returns>
        public async Task<FileInfoShort> SaveFileToGridFS(IFormFile file)
        {
            using (var stream = file.OpenReadStream())
            {
                var fileId = ObjectId.GenerateNewId();
                var options = new GridFSUploadOptions
                {

                    Metadata = new BsonDocument { { "originalFileName", file.FileName } }
                };

                await gridFSBucket.UploadFromStreamAsync(fileId, file.FileName, stream, options);

                return new FileInfoShort() { FileId = fileId.ToString(), FileName = file.FileName };
            }
        }

        /// <summary>
        /// TEST for file saving form PC in MongoDB using GridFS
        /// </summary>
        /// <param name="file">FileInfo of a file</param>
        /// <returns>Short fileinfo about file: ObjectId and it's short name</returns>
        public async Task<FileInfoShort> SaveToGridFS_Test(FileInfo file)
        {
            using (var stream = file.OpenRead())
            {
                var fileId = ObjectId.GenerateNewId();
                var options = new GridFSUploadOptions
                {

                    Metadata = new BsonDocument { { "originalFileName", file.Name } }
                };
                await gridFSBucket.UploadFromStreamAsync(fileId, file.Name, stream, options);

                return new FileInfoShort() { FileId = fileId.ToString(), FileName = file.Name };
            }
        }

        /// <summary>
        /// Provides downloading form MongoDB in gridFS
        /// </summary>
        /// <param name="fileId">Id of the file</param>
        /// <returns>Stream</returns>
        public async Task<DBFileRet?> LoadFromGridFs(string fileId)
        {
            var file = await gridFSBucket.Find(Builders<GridFSFileInfo>.Filter.Eq(x => x.Id.ToString(), fileId)).FirstOrDefaultAsync();

            if (file != null)
            {
                var stream = new MemoryStream();
                await gridFSBucket.DownloadToStreamAsync(fileId, stream);

                return new DBFileRet() { FileName = file.Filename, FileStream = stream };
            }
            return null;

        }
        //------------------------------------------------------------------------------------------

        //
        // ITEMS FUNCTIONALITY
        //------------------------------------------------------------------------------------------

        /// <summary>
        /// Upsert of list of items. First variant
        /// </summary>
        /// <param name="items">List of Basic items</param>
        /// <returns></returns>
        public async Task addOrUpdateItems(List<BasicItem> items)
        {
            var upsert = new UpdateOptions() { IsUpsert = true };

            foreach (var item in items)
            {
                if (String.IsNullOrEmpty(item.Id))
                    item.Id = ObjectId.GenerateNewId().ToString();

                var filter = Builders<BasicItem>.Filter.Eq(_ => _.Id, item.Id);
                var update = Builders<BasicItem>.Update
                    .Set(_ => _.Header, item.Header)
                    .Set(_ => _.Description, item.Description)
                    .Set(_ => _.Itemtype, item.Itemtype)
                    .Set(_ => _.TileSizeX, item.TileSizeX)
                    .Set(_ => _.TileSizeY, item.TileSizeY)
                    .Set(_ => _.CreatorId, item.CreatorId)
                    .Set(_ => _.ParentId, item.ParentId)
                    .Set(_ => _.BackgroundColor, item.BackgroundColor)
                    .Set(_ => _.BackgroundImageId, item.BackgroundImageId)
                    .Set(_ => _.Coordinates, item.Coordinates)
                    .Set(_ => _.Tags, item.Tags)
                    .Set(_ => _.TaskSetDate, item.TaskSetDate)
                    .Set(_ => _.File, item.File)
                    .SetOnInsert(_ => _.Id, item.Id);

                await database.GetCollection<BasicItem>("Items").UpdateOneAsync(filter, update, upsert);
            }
        }
        /// <summary>
        /// Adds one item to DB 
        /// </summary>
        /// <param name="item">Basicitem item</param>
        /// <returns></returns>
        public async Task addOneitem(BasicItem item)
        {
            await database.GetCollection<BasicItem>("Items").InsertOneAsync(item);
        }

        /// <summary>
        /// Find all screens for a selected user
        /// </summary>
        /// <param name="userId">Id of creator</param>
        /// <returns></returns>
        public async Task<List<BasicItem>> getListOfScreensForUser(string userId)
        {
            return await (await database.GetCollection<BasicItem>("Items").FindAsync(_ => _.CreatorId == userId && _.Itemtype == Itemtype.SCREEN)).ToListAsync();
        }

        /// <summary>
        /// Returns an Item and it's children
        /// </summary>
        /// <param name="parentId">Item's id</param>
        /// <returns>List of items</returns>
        public async Task<List<BasicItem>> getListOfScreenChildren(string parentId)
        {
            var collection = database.GetCollection<BasicItem>("Items");
            return await childrenSearch(parentId, collection);
        }

        /// <summary>
        /// Deletes item and all of it's childern
        /// </summary>
        /// <param name="parentId">Item's id</param>
        /// <returns></returns>
        public async Task deleteListOfChildren(string parentId)
        {
            var collection = database.GetCollection<BasicItem>("Items");
            var firstnode = await (await collection.FindAsync(_ => _.Id == parentId)).FirstOrDefaultAsync();
            if (firstnode != null)
            {
                await recursiveDelete(firstnode, collection);
            }

        }

        //
        //Items subfunctionality
        //------------------------------------------------------------------------------------------

        private async Task recursiveDelete(BasicItem item, IMongoCollection<BasicItem> collection)
        {
            await collection.DeleteOneAsync(_ => _.Id == item.Id);
            foreach (var child in await getChildren(item.Id, collection))
            {
                await recursiveDelete(child, collection);
            }
        }

        private async Task<List<BasicItem>> getChildren(string parentId, IMongoCollection<BasicItem> collection)
        {
            return await (await collection.FindAsync(_ => _.ParentId == parentId)).ToListAsync();
        }

        private async Task<List<BasicItem>> childrenSearch(string parentId, IMongoCollection<BasicItem> collection)
        {
            var results = new List<BasicItem>();
            var nodes = await (await collection.FindAsync(_ => _.ParentId == parentId)).ToListAsync();
            foreach (var node in nodes)
            {
                if (node != null)
                {

                    results.Add(node);
                    results.AddRange(await childrenSearch(node.Id, collection));
                }
            }
            return results;           
        }

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------

        //
        //USER FUNCTIONALITY
        //------------------------------------------------------------------------------------------

        /// <summary>
        /// Finds user by Id
        /// </summary>
        /// <param name="Id">Id of a user</param>
        /// <returns>User</returns>
        public async Task<User> findUserById(string Id)
        {
            return await (await database.GetCollection<User>("Users").FindAsync(_ => _.Id == Id && _.IsDeleted == false)).FirstOrDefaultAsync();
        }

        /// <summary>
        /// Adds new user
        /// </summary>
        /// <param name="user">User instance</param>
        /// <returns></returns>
        public async Task addNewUser(User user)
        {
            user.RegisterDate = DateTime.Now;
            await database.GetCollection<User>("Users").InsertOneAsync(user);
        }

        /// <summary>
        /// Provides ability to find user by login/email/phone and checks if password matches and whether user is not deleted 
        /// </summary>
        /// <param name="loginparam">Login string. Could be login, email or phone number</param>
        /// <param name="password">User's password</param>
        /// <returns>User</returns>
        public async Task<User> findUserBySearchParams(string loginparam, string password)
        {
            return await (await database.GetCollection<User>("Users").FindAsync(_ => (_.Login == loginparam || _.Email == loginparam || _.Phone == loginparam) && _.Password == password && _.IsDeleted == false)).FirstOrDefaultAsync();
        }

        /// <summary>
        /// Updates user's name
        /// </summary>
        /// <param name="user">User instance</param>
        /// <returns></returns>
        public async Task updateUserName(User user)
        {
            var update = Builders<User>.Update
                .Set(_ => _.Name, user.Name);
            await database.GetCollection<User>("Users").FindOneAndUpdateAsync(_ => _.Id == user.Id, update);
        }

        /// <summary>
        /// Updates user's password
        /// </summary>
        /// <param name="user">User instance</param>
        /// <returns></returns>
        public async Task updateUserPassword(User user)
        {
            var update = Builders<User>.Update
                .Set(_ => _.Password, user.Password);
            await database.GetCollection<User>("Users").FindOneAndUpdateAsync(_ => _.Id == user.Id, update);
        }

        /// <summary>
        /// Updates user's description
        /// </summary>
        /// <param name="user">User instance</param>
        /// <returns></returns>
        public async Task updateUserDescription(User user)
        {
            var update = Builders<User>.Update
                .Set(_ => _.Description, user.Description);
            await database.GetCollection<User>("Users").FindOneAndUpdateAsync(_ => _.Id == user.Id, update);
        }

        /// <summary>
        /// Updates user's email
        /// </summary>
        /// <param name="user">User instance</param>
        /// <returns></returns>
        public async Task updateUserEmail(User user)
        {
            var update = Builders<User>.Update
                .Set(_ => _.Email, user.Email);
            await database.GetCollection<User>("Users").FindOneAndUpdateAsync(_ => _.Id == user.Id, update);
        }

        /// <summary>
        /// Updates user's phone
        /// </summary>
        /// <param name="user">User instance</param>
        /// <returns></returns>
        public async Task updateUserPhone(User user)
        {
            var update = Builders<User>.Update
                .Set(_ => _.Phone, user.Phone);
            await database.GetCollection<User>("Users").FindOneAndUpdateAsync(_ => _.Id == user.Id, update);
        }

        /// <summary>
        /// Updates user's image's Id
        /// </summary>
        /// <param name="user">User's instance</param>
        /// <returns></returns>
        public async Task updateUserImageId(User user)
        {
            var update = Builders<User>.Update
                .Set(_ => _.UserImageId, user.UserImageId);
            await database.GetCollection<User>("Users").FindOneAndUpdateAsync(_ => _.Id == user.Id, update);
        }

        /// <summary>
        /// Deletes user. Note that it doesn't really delete it from database, but merely marks as deleted 
        /// </summary>
        /// <param name="userId">Id of a user</param>
        /// <returns></returns>
        public async Task deleteUserById(string userId)
        {
            var update = Builders<User>.Update.Set(_ => _.IsDeleted, true);
            await database.GetCollection<User>("Users").FindOneAndUpdateAsync(_ => _.Id == userId, update);
        }

        //------------------------------------------------------------------------------------------

    }


}
