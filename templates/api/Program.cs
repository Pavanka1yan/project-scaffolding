using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);

var enableAuth = builder.Configuration.GetValue<bool>("Features:EnableAuth");

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

builder.Services.AddControllers();

var app = builder.Build();

if (enableAuth)
{
    app.UseAuthentication();
    app.UseAuthorization();
}

app.MapControllers();

app.Run();
