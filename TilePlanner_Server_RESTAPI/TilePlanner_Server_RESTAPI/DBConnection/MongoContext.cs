using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using TilePlanner_Server_RESTAPI.ORM;
using TilePlanner_Server_RESTAPI.ORM.Roles;

namespace TilePlanner_Server_RESTAPI.DBConnection
{
    public class MongoContext
    {

        private IMongoDatabase database;
        private GridFSBucket gridFSBucket;

        public MongoContext()
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
            if (!database.ListCollectionNames().ToList().Contains("Items"))
                database.CreateCollection("Items");
            if (!database.ListCollectionNames().ToList().Contains("Roles"))
            {
                database.CreateCollection("Roles");
                var indexOptions = new CreateIndexOptions() { Unique = true };
                var indexModel = new CreateIndexModel<Role>("{ UserId: 1 }", indexOptions);
                database.GetCollection<Role>("Roles").Indexes.CreateOne(indexModel);
            }
            if (!database.ListCollectionNames().ToList().Contains("Transactions"))
                database.CreateCollection("Transactions");
            if (!database.ListCollectionNames().ToList().Contains("Notifications"))
                database.CreateCollection("Notifications");
        }

        //------------------------------------------------------------------------------------------
        // FOR TESTING PURPOSES
        //------------------------------------------------------------------------------------------
        public List<BasicItem> Test()
        {
            var collection = database.GetCollection<BasicItem>("Items");
            // var itemtest = collection.Find("{}").ToList<IBasicItem>();
            var screen = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), Itemtype = Itemtype.SCREEN, Header = "Screen" };
            var tab = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), Itemtype = Itemtype.TAB, ParentId = screen.Id.ToString(), Header = "Tab" };
            var tile = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), Itemtype = Itemtype.TILE, ParentId = tab.Id.ToString(), Header = "Tile" };
            var text1 = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), Itemtype = Itemtype.TEXT, ParentId = tile.Id.ToString(), Header = "Text1" };
            var text2 = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), Itemtype = Itemtype.TEXT, ParentId = tile.Id.ToString(), Header = "Text2" };
            var task = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), Itemtype = Itemtype.TASK, ParentId = tile.Id.ToString(), Header = "Task" };
            collection.InsertMany(new List<BasicItem>() { screen, tab, tile, text1, text2, task });
            var coll = collection.Find("{}").ToList();
            return coll;
        }
        //------------------------------------------------------------------------------------------

        //------------------------------------------------------------------------------------------
        //GRIDFS FILE SAVE/FILE LOAD
        //------------------------------------------------------------------------------------------

        /// <summary>
        /// Saves file into the MongoDB database using GridFS
        /// </summary>
        /// <param name="file">File from request</param>
        /// <returns>Short info about file</returns>
        public async Task<FileInfoShortDAO> SaveFileToGridFS(IFormFile file)
        {
            using (var stream = file.OpenReadStream())
            {
                var fileId = ObjectId.GenerateNewId();
                var options = new GridFSUploadOptions
                {

                    Metadata = new BsonDocument { { "originalFileName", file.FileName } }
                };

                await gridFSBucket.UploadFromStreamAsync(fileId, file.FileName, stream, options);

                return new FileInfoShortDAO() { FileId = fileId.ToString(), FileName = file.FileName };
            }
        }

        /// <summary>
        /// TEST for file saving form PC in MongoDB using GridFS
        /// </summary>
        /// <param name="file">FileInfo of a file</param>
        /// <returns>Short fileinfo about file: ObjectId and it's short name</returns>
        public async Task<FileInfoShortDAO> SaveToGridFS_Test(FileInfo file)
        {
            using (var stream = file.OpenRead())
            {
                var fileId = ObjectId.GenerateNewId();
                var options = new GridFSUploadOptions
                {

                    Metadata = new BsonDocument { { "originalFileName", file.Name } }
                };
                await gridFSBucket.UploadFromStreamAsync(fileId, file.Name, stream, options);

                return new FileInfoShortDAO() { FileId = fileId.ToString(), FileName = file.Name };
            }
        }

        /// <summary>
        /// Provides downloading form MongoDB in gridFS
        /// </summary>
        /// <param name="fileId">Id of the file</param>
        /// <returns>Stream</returns>
        public async Task<DBFileRetDAO?> LoadFromGridFs(ObjectId fileId)
        {
            var filter = Builders<GridFSFileInfo>.Filter.Eq("_id", fileId);
            var result = await gridFSBucket.FindAsync(filter);
            var file = await result.FirstOrDefaultAsync();

            if (file != null)
            {
                var stream = new MemoryStream();
                await gridFSBucket.DownloadToStreamAsync(fileId, stream);
                return new DBFileRetDAO() { FileName = file.Filename, FileContents = stream.ToArray() };
            }
            return null;

        }
        //------------------------------------------------------------------------------------------

        //------------------------------------------------------------------------------------------
        // ITEMS FUNCTIONALITY
        //------------------------------------------------------------------------------------------

        /// <summary>
        /// Upsert of list of items. First variant
        /// </summary>
        /// <param name="items">List of Basic items</param>
        /// <returns></returns>
        public async Task AddOrUpdateItems(List<BasicItem> items)
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
        public async Task AddOneitem(BasicItem item)
        {
            await database.GetCollection<BasicItem>("Items").InsertOneAsync(item);
        }

        /// <summary>
        /// Find all screens for a selected user
        /// </summary>
        /// <param name="userId">Id of creator</param>
        /// <returns></returns>
        public async Task<List<BasicItem>> GetListOfScreensForUser(string userId)
        {
            return await (await database.GetCollection<BasicItem>("Items").FindAsync(_ => _.CreatorId == userId && _.Itemtype == Itemtype.SCREEN)).ToListAsync();
        }

        /// <summary>
        /// Returns an Item and it's children
        /// </summary>
        /// <param name="parentId">Item's id</param>
        /// <returns>List of items</returns>
        public async Task<List<BasicItem>> GetListOfScreenChildren(string parentId)
        {
            var collection = database.GetCollection<BasicItem>("Items");
            return await ChildrenSearch(parentId, collection);
        }

        /// <summary>
        /// Deletes item and all of it's childern
        /// </summary>
        /// <param name="parentId">Item's id</param>
        /// <returns></returns>
        public async Task DeleteListOfChildren(string parentId)
        {
            var collection = database.GetCollection<BasicItem>("Items");
            var firstnode = await (await collection.FindAsync(_ => _.Id == parentId)).FirstOrDefaultAsync();
            if (firstnode != null)
            {
                await RecursiveDelete(firstnode, collection);
            }

        }

        //------------------------------------------------------------------------------------------
        //Items subfunctionality
        //------------------------------------------------------------------------------------------

        private async Task RecursiveDelete(BasicItem item, IMongoCollection<BasicItem> collection)
        {
            await collection.DeleteOneAsync(_ => _.Id == item.Id);
            foreach (var child in await GetChildren(item.Id, collection))
            {
                await RecursiveDelete(child, collection);
            }
        }


        private async Task<List<BasicItem>> GetChildren(string parentId, IMongoCollection<BasicItem> collection)
        {
            return await (await collection.FindAsync(_ => _.ParentId == parentId)).ToListAsync();
        }

        private async Task<List<BasicItem>> ChildrenSearch(string parentId, IMongoCollection<BasicItem> collection)
        {
            var results = new List<BasicItem>();
            var nodes = await (await collection.FindAsync(_ => _.ParentId == parentId)).ToListAsync();
            foreach (var node in nodes)
            {
                if (node != null)
                {

                    results.Add(node);
                    results.AddRange(await ChildrenSearch(node.Id, collection));
                }
            }
            return results;
        }

        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------

        //------------------------------------------------------------------------------------------
        //TRANSACTION FUNCTIONALITY
        //------------------------------------------------------------------------------------------

        /// <summary>
        /// Adds new transaction data
        /// </summary>
        /// <param name="transactionData">Transaction data class instance</param>
        /// <returns>Added item</returns>

        public async Task<TransactionData> AddTransactionData(TransactionData transactionData)
        {
            if (string.IsNullOrEmpty(transactionData.Id))
            {
                transactionData.Id = ObjectId.GenerateNewId().ToString();
            }
            await database.GetCollection<TransactionData>("Transactions").InsertOneAsync(transactionData);
            return transactionData;
        }

        /// <summary>
        /// Gets all transactions fro specified user's Id
        /// </summary>
        /// <param name="userId">User's Id</param>
        /// <returns>Collection</returns>

        public async Task<List<TransactionData>> GetTransactionsForUserAsync(string userId)
        {
            return await (await database.GetCollection<TransactionData>("Transactions").FindAsync(_ => _.UserId == userId)).ToListAsync();
        }

        //------------------------------------------------------------------------------------------

        //------------------------------------------------------------------------------------------
        //NOTIFICATIONS FUNCTIONALITY
        //------------------------------------------------------------------------------------------

        /// <summary>
        /// Creates or updates notifications
        /// </summary>
        /// <param name="notification">Notification class instance</param>
        /// <returns>Added item</returns>

        public async Task<Notification> CreateUpdateNotification(Notification notification)
        {
            if (String.IsNullOrEmpty(notification.Id))
            {
                notification.Id = ObjectId.GenerateNewId().ToString();
            }
            var upsert = new UpdateOptions() { IsUpsert = true };

            var update = Builders<Notification>.Update
                .Set(_ => _.Header, notification.Header)
                .Set(_ => _.NotificationTime, notification.NotificationTime)
                .Set(_ => _.IsDone, notification.IsDone)
                .Set(_ => _.UserId, notification.UserId)
                .SetOnInsert(_ => _.Id, notification.Id); ;

            await database.GetCollection<Notification>("Notifications").UpdateOneAsync(_ => _.Id == notification.Id, update, upsert);
            return notification;
        }

        /// <summary>
        /// Gets
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>

        public async Task<List<Notification>> GetNotificationsForUser(string userId)
        {
            return await (await database.GetCollection<Notification>("Notifications").FindAsync(_ => _.UserId == userId)).ToListAsync();
        }

        public async Task DeleteNotification(string notificationId)
        {
            await database.GetCollection<Notification>("Notifications").DeleteOneAsync(_ => _.Id == notificationId);
        }

        public async Task DeleteAllNotificationsForUser(string userId)
        {
            await database.GetCollection<Notification>("Notifications").DeleteManyAsync(_ => _.UserId == userId);
        }

        //------------------------------------------------------------------------------------------


        //------------------------------------------------------------------------------------------
        //ROLE & CLAIM FUNCTIONALITY
        //------------------------------------------------------------------------------------------


        public async Task<Role> AddNewRole(string userId)
        {
            var role = new Role() { Id = ObjectId.GenerateNewId().ToString(), EndTime = null, UserId = userId, AccessLevel = AccessLevel.BASIC };
            await database.GetCollection<Role>("Roles").InsertOneAsync(role);
            return role;
        }

        public async Task<Role?> UpdateRole(string userId, AccessLevel accesslevel, double daystoadd)
        {
            var role = await (await database.GetCollection<Role>("Roles").FindAsync(_ => _.UserId == userId)).FirstAsync();
            if (role != default(Role))
            {
                role.AccessLevel = accesslevel;
                role.EndTime = role.EndTime != null ? role.EndTime?.AddDays(daystoadd) : DateTime.Now.AddDays(daystoadd);
                var update = Builders<Role>.Update
                    .Set(_ => _.AccessLevel, role.AccessLevel)
                    .Set(_ => _.EndTime, role.EndTime)
                    .Set(_ => _.UserId, role.UserId);

                await database.GetCollection<Role>("Roles").UpdateOneAsync<Role>(_ => _.Id == role.Id, update);
                return role;
            }
            else return null;
        }

        public async Task<Role> FindRoleByUserId(string userId)
        {
            return await (await database.GetCollection<Role>("Roles").FindAsync(_ => _.UserId == userId)).FirstAsync();
        }

        public async Task<Role> FindRoleById(string roleId)
        {
            return await (await database.GetCollection<Role>("Roles").FindAsync(_ => _.Id == roleId)).FirstAsync();
        }

        public async Task<long> CountAllItemsForUserId(string userId)
        {
            var count = 0L;
            count = await database.GetCollection<BasicItem>("Itmes").CountDocumentsAsync(_ => _.CreatorId == userId);
            return count;
        }

        //------------------------------------------------------------------------------------------

        //------------------------------------------------------------------------------------------
        //USER FUNCTIONALITY
        //------------------------------------------------------------------------------------------

        /// <summary>
        /// Finds user by Id
        /// </summary>
        /// <param name="Id">Id of a user</param>
        /// <returns>User</returns>
        public async Task<User> FindUserById(string Id)
        {
            return await (await database.GetCollection<User>("Users").FindAsync(_ => _.Id == Id && _.IsDeleted == false)).FirstOrDefaultAsync();
        }

        /// <summary>
        /// Adds new user
        /// </summary>
        /// <param name="user">User instance</param>
        /// <returns></returns>
        public async Task<User> AddNewUser(User user)
        {
            if (String.IsNullOrEmpty(user.Id))
            {
                user.Id = ObjectId.GenerateNewId().ToString();
            }
            user.RegisterDate = DateTime.Now;
            await database.GetCollection<User>("Users").InsertOneAsync(user);
            await AddNewRole(user.Id);
            return user;
        }

        /// <summary>
        /// Provides ability to find user by login/email/phone and checks if password matches and whether user is not deleted 
        /// </summary>
        /// <param name="loginparam">Login string. Could be login, email or phone number</param>
        /// <param name="password">User's password</param>
        /// <returns>User</returns>
        public async Task<User> FindUserBySearchParams(string loginparam, string password)
        {
            return await (await database.GetCollection<User>("Users").FindAsync(_ => (_.Login == loginparam || _.Email == loginparam || _.Phone == loginparam) && _.Password == password && _.IsDeleted == false)).FirstOrDefaultAsync();
        }

        public async Task<User> CheckIfUserAlreadyExists(string loginparam)
        {
            return await (await database.GetCollection<User>("Users").FindAsync(_ => (_.Login == loginparam || (_.Email == loginparam && !String.IsNullOrEmpty(_.Email)) || (_.Phone == loginparam && !String.IsNullOrEmpty(_.Phone))) && _.IsDeleted == false)).FirstOrDefaultAsync();
        }

        /// <summary>
        /// Updates user's name
        /// </summary>
        /// <param name="user">User instance</param>
        /// <returns></returns>
        public async Task UpdateUserName(User user)
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
        public async Task UpdateUserPassword(User user)
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
        public async Task UpdateUserDescription(User user)
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
        public async Task UpdateUserEmail(User user)
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
        public async Task UpdateUserPhone(User user)
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
        public async Task UpdateUserImageId(User user)
        {
            var update = Builders<User>.Update
                .Set(_ => _.UserImageId, user.UserImageId);
            var result = await database.GetCollection<User>("Users").FindOneAndUpdateAsync(_ => _.Id == user.Id, update);
        }

        public async Task SetGoogleUser(User user)
        {
            var update = Builders<User>.Update
                .Set(_ => _.IsGoogle, user.IsGoogle);
            await database.GetCollection<User>("Users").FindOneAndUpdateAsync(_ => _.Id == user.Id, update);
        }

        /// <summary>
        /// Deletes user. Note that it doesn't really delete it from database, but merely marks as deleted 
        /// </summary>
        /// <param name="userId">Id of a user</param>
        /// <returns></returns>
        public async Task DeleteUserById(string userId)
        {
            var update = Builders<User>.Update.Set(_ => _.IsDeleted, true);
            await database.GetCollection<User>("Users").FindOneAndUpdateAsync(_ => _.Id == userId, update);
        }



        //------------------------------------------------------------------------------------------

    }


}
