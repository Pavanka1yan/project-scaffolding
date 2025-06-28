using System;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using Microsoft.Extensions.Http;
using Refit;

public interface IRefitHttpClientService<TClient> where TClient : class
{
    TClient Api { get; }
}

public class RefitHttpClientService<TClient> : IRefitHttpClientService<TClient> where TClient : class
{
    public TClient Api { get; }

    public RefitHttpClientService(IHttpClientFactory factory, IConfiguration config)
    {
        var baseUrl = config[$"ServiceUrls:{typeof(TClient).Name}"]; 
        if (string.IsNullOrWhiteSpace(baseUrl))
        {
            throw new ArgumentException($"Base URL for {typeof(TClient).Name} not configured");
        }
        var httpClient = factory.CreateClient(typeof(TClient).Name);
        httpClient.BaseAddress = new Uri(baseUrl);
        Api = RestService.For<TClient>(httpClient);
    }
}
