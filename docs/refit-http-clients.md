# Shared HTTP Client Service

When `enableHttpClients` is set to `true` in `scaffold.config.json`, the API template registers a generic Refit-based HTTP client. Base URLs are read from the `ServiceUrls` section of `appsettings.json`.

```csharp
// Program.cs fragment
if (enableHttpClients)
{
    builder.Services.AddHttpClient();
    builder.Services.AddTransient(typeof(IRefitHttpClientService<>), typeof(RefitHttpClientService<>));
}
```

Interfaces for remote APIs can be defined and resolved via `IRefitHttpClientService<T>`.

```csharp
public interface IWeatherApi
{
    [Get("/forecast")] Task<Forecast[]> GetForecastAsync();
}

public class WeatherService
{
    private readonly IWeatherApi _api;
    public WeatherService(IRefitHttpClientService<IWeatherApi> service)
    {
        _api = service.Api;
    }

    public Task<Forecast[]> GetAsync() => _api.GetForecastAsync();
}
```
