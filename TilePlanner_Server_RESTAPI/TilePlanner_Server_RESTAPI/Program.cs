using TilePlanner_Server_RESTAPI.BrainTreePayPalPayment;
using TilePlanner_Server_RESTAPI.DBConnection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddSingleton<MongoWork>();
builder.Services.AddTransient<IBrainTreeService, BrainTreeService>();

var app = builder.Build();

//var mongoDBaccess = new MongoWork();

//mongoDBaccess.Test();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
