using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Identity.Web;
using Microsoft.EntityFrameworkCore;

// Registers EF Core services when enabled

var builder = WebApplication.CreateBuilder(args);

var enableAuth = builder.Configuration.GetValue<bool>("Features:EnableAuth");
var enableEf = builder.Configuration.GetValue<bool>("Features:EnableEf");

if (enableAuth)
{
    builder.Services
        .AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
        .AddMicrosoftIdentityWebApp(options =>
        {
            builder.Configuration.Bind("AzureAd", options);
            options.ResponseType = "code";
            options.UsePkce = true;
        });
    builder.Services.AddAuthorization();
}

if (enableEf)
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.{{efProvider}}(connectionString));
    builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
}

builder.Services.AddControllers();

var app = builder.Build();

if (enableAuth)
{
    app.UseAuthentication();
    app.UseAuthorization();
}

app.MapControllers();

app.Run();
