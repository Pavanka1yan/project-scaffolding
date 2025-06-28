using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("[controller]")]
public class StatusController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly IServiceProvider _services;

    public StatusController(IConfiguration config, IServiceProvider services)
    {
        _config = config;
        _services = services;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var features = _config.GetSection("Features");
        bool enableEf = features.GetValue<bool>("EnableEf");
        bool dbConnected = false;

        if (enableEf)
        {
            using var scope = _services.CreateScope();
            var db = scope.ServiceProvider.GetService<AppDbContext>();
            if (db != null)
            {
                try
                {
                    dbConnected = await db.Database.CanConnectAsync();
                }
                catch
                {
                    dbConnected = false;
                }
            }
        }

        var result = new
        {
            enableAuth = features.GetValue<bool>("EnableAuth"),
            enableEf,
            enableSwagger = features.GetValue<bool>("EnableSwagger"),
            enableCors = features.GetValue<bool>("EnableCors"),
            enableHttpClients = features.GetValue<bool>("EnableHttpClients"),
            dbConnected,
            authenticated = User?.Identity?.IsAuthenticated == true,
            user = User?.Identity?.IsAuthenticated == true ? User.Identity?.Name : null
        };

        return Ok(result);
    }
}

