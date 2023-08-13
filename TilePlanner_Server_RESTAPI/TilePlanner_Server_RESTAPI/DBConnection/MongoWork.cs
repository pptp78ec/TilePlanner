using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using TilePlanner_Server_RESTAPI.ORM;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Bson.Serialization;
using Newtonsoft.Json;
using MongoDB.Driver.GridFS;

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
            
        }

        public List<BasicItem> Test()
        {
            var collection = database.GetCollection<BasicItem>("Items");
           // var itemtest = collection.Find("{}").ToList<IBasicItem>();
            var screen = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), Header = "Screen"};
            var tab = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), ParentId = screen.Id.ToString(), Header = "Tab" };
            var tile = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), ParentId = tab.Id.ToString(), Header = "Tile" };
            var text1 = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), ParentId = tile.Id.ToString(), Header = "Text1" };
            var text2 = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), ParentId = tile.Id.ToString(), Header = "Text2" };
            var task = new BasicItem() { Id = ObjectId.GenerateNewId().ToString(), ParentId = tile.Id.ToString(), Header = "Task" };
            collection.InsertMany(new List<BasicItem>() {screen, tab, tile, text1, text2, task});
            var coll = collection.Find("{}").ToList();
            var stringjs = JsonConvert.SerializeObject(coll);
            return coll;
        }

        /// <summary>
        /// Saves file into the MongoDB database using GridFS
        /// </summary>
        /// <param name="file">File from request</param>
        /// <returns>Short info about file</returns>
        public async Task<FileInfoShort> SaveFileToGridFS(IFormFile file)
        {
            using (var stream = file.OpenReadStream()) {
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
            using(var stream = file.OpenRead())
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
        /// Proveides downloading form MongoDB in gridFS
        /// </summary>
        /// <param name="fileId">Id of the file</param>
        /// <returns>Stream</returns>
        public async Task<Stream?> LoadFromGridFs(string fileId)
        {
            var file = await gridFSBucket.Find(Builders<GridFSFileInfo>.Filter.Eq(x => x.Id.ToString(), fileId)).FirstOrDefaultAsync();

            if (file != null)
            {
                var stream = new MemoryStream();
                await gridFSBucket.DownloadToStreamAsync(fileId, stream);
                return stream;
            }
            return null;
            
        }
        
        public async Task addOrUpdateItems(List<BasicItem> items)
        {
            foreach (var item in items)
            {
                //await database.GetCollection<BasicItem>("Items").UpdateManyAsync(items,))
            }
        }

        public async Task addOneitem(BasicItem item)
        {
            await database.GetCollection<BasicItem>("Items").InsertOneAsync(item);
        }

    }
}
