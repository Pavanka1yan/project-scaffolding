using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);

var features = builder.Configuration.GetSection("Features");
var enableAuth = features.GetValue<bool>("EnableAuth");
var enableEf = features.GetValue<bool>("EnableEf");
var enableSwagger = features.GetValue<bool>("EnableSwagger");
var enableCors = features.GetValue<bool>("EnableCors");

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

if (enableCors)
{
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
    });
}

if (enableSwagger)
{
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
}

builder.Services.AddTransient<GlobalExceptionHandlingMiddleware>();

var app = builder.Build();

app.UseMiddleware<GlobalExceptionHandlingMiddleware>();

if (enableSwagger)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (enableCors)
{
    app.UseCors();
}

if (enableAuth)
{
    app.UseAuthentication();
    app.UseAuthorization();
}

app.MapControllers();

app.Run();

public class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;

    public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsJsonAsync(new { error = "An unexpected error occurred." });
        }
    }
}
