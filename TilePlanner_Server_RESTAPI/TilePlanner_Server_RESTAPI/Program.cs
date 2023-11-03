using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using TilePlanner_Server_RESTAPI;
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
    var issuer = builder.Configuration.GetValue<string>("JWT:Issuer") ?? "Issuer";
    var audience = builder.Configuration.GetValue<string>("JWT:Audience") ?? "Audience";
    var key = builder.Configuration.GetValue<string>("JWT:Key") ?? "This is the key for this app";
    var lifetime = builder.Configuration.GetValue<int>("JWT:Lifetime");

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

builder.Services.AddAuthorization();
builder.Services.AddSingleton<Authenticate>();
#endif

builder.Services.AddSingleton<MongoContext>();
builder.Services.AddTransient<IBrainTreeService, BrainTreeService>();


builder.Services
#if DEBUG
    .AddControllers(opts => opts.Filters.Add(new CorsFilter()))
#endif
    .AddJsonOptions(x =>
{
    x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    x.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
}); ;


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
app.UseAuthentication();
app.UseAuthorization();
#endif
#endif

app.UseCors(cors =>
{
    cors.AllowAnyOrigin();
    cors.AllowAnyHeader();
    cors.AllowAnyMethod();
});
app.UseHttpsRedirection();

app.MapControllers();

app.Run();
