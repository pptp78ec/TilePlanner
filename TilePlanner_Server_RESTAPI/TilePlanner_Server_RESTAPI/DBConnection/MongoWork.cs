﻿using MongoDB.Driver;
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


    }
}
