using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TilePlanner_Server_RESTAPI.Auth;
using TilePlanner_Server_RESTAPI.BrainTreePayPalPayment;
using TilePlanner_Server_RESTAPI.DBConnection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

#if AUTHALT

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    var builder = new ConfigurationBuilder();
    builder.AddJsonFile("appsettings.json");
    IConfiguration configuration = builder.Build();
    var issuer = configuration.GetValue<string>("JWT:Issuer") ?? "Issuer";
    var audience = configuration.GetValue<string>("JWT:Audience") ?? "Audience";
    var key = configuration.GetValue<string>("JWT:Key") ?? "This is the key for this app";
    var lifetime = configuration.GetValue<int>("JWT:Lifetime");

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = true,
        ValidAudience = audience,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key))
    };

});

builder.Services.AddSingleton<Authenticate>();

#endif


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

#if AUTHALT
#if AUTHALT_ENABLED
    app.UseAuthorization();
    app.UseAuthentication();
#endif
#endif

app.UseCors(cors =>
{
    cors.AllowAnyOrigin();
    cors.AllowAnyHeader();
    cors.AllowAnyMethod();
});
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
