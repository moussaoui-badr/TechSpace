using System.Net;
using System.Text.Json;
using Polly;
using Polly.Extensions.Http;
using TechSpace.Scraper.Cache;
using TechSpace.Scraper.Shopify.Models;

namespace TechSpace.Scraper.Shopify;

public class ShopifyClient(HttpClient http, DiskCache cache, ILogger<ShopifyClient> logger)
{
    private static readonly JsonSerializerOptions Json = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    private readonly SemaphoreSlim _throttle = new(1, 1);
    private DateTime _lastRequest = DateTime.MinValue;
    private const int MinDelayMs = 350; // ~3 req/s

    public async Task<List<ShopifyCollection>> GetAllCollectionsAsync(CancellationToken ct)
    {
        var result = new List<ShopifyCollection>();

        var custom = await PaginateAsync<ShopifyCollectionsResponse>(
            "/custom_collections.json?limit=250", "collections", ct);
        result.AddRange(custom.SelectMany(r => r.Collections));

        var smart = await PaginateAsync<ShopifySmartCollectionsResponse>(
            "/smart_collections.json?limit=250", "smart_collections", ct);
        result.AddRange(smart.SelectMany(r => r.Collections));

        logger.LogInformation("Collections récupérées : {Count}", result.Count);
        return result;
    }

    public async Task<List<ShopifyProduct>> GetProductsByCollectionAsync(string collectionHandle, CancellationToken ct)
    {
        var pages = await PaginateAsync<ShopifyProductsResponse>(
            $"/collections/{collectionHandle}/products.json?limit=250", "products", ct);
        return pages.SelectMany(r => r.Products).ToList();
    }

    public async Task<List<ShopifyProduct>> GetAllProductsAsync(CancellationToken ct)
    {
        var pages = await PaginateAsync<ShopifyProductsResponse>(
            "/products.json?limit=250", "products", ct);
        return pages.SelectMany(r => r.Products).ToList();
    }

    public async Task<ShopifyProductJs?> GetProductJsAsync(string handle, CancellationToken ct)
    {
        try
        {
            var json = await FetchAsync($"/products/{handle}.js", ct);
            return JsonSerializer.Deserialize<ShopifyProductJs>(json, Json);
        }
        catch (Exception ex)
        {
            logger.LogWarning("Impossible de charger /products/{Handle}.js : {Err}", handle, ex.Message);
            return null;
        }
    }

    public async Task<string> GetHomeHtmlAsync(CancellationToken ct)
        => await FetchAsync("/", ct);

    private async Task<List<T>> PaginateAsync<T>(string urlPath, string context, CancellationToken ct)
    {
        var results = new List<T>();
        var page = 1;

        while (true)
        {
            var separator = urlPath.Contains('?') ? "&" : "?";
            var paged = $"{urlPath}{separator}page={page}";
            var json = await FetchAsync(paged, ct);

            var item = JsonSerializer.Deserialize<T>(json, Json);
            if (item is null) break;

            // Détection de fin de pagination : vérifier si la collection est vide via réflexion
            var prop = typeof(T).GetProperties().FirstOrDefault(p =>
                p.PropertyType.IsGenericType &&
                p.PropertyType.GetGenericTypeDefinition() == typeof(List<>));

            if (prop?.GetValue(item) is System.Collections.IList list && list.Count == 0)
                break;

            results.Add(item);
            page++;
        }

        return results;
    }

    private async Task<string> FetchAsync(string path, CancellationToken ct)
    {
        var cacheKey = path.Replace('/', '_').Replace('?', '_').Replace('&', '_').TrimStart('_');
        var cached = await cache.GetAsync(cacheKey, ct);
        if (cached is not null) return cached;

        await ThrottleAsync(ct);

        var response = await http.GetAsync(path, ct);

        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning("HTTP {Status} pour {Path}", (int)response.StatusCode, path);
            response.EnsureSuccessStatusCode();
        }

        var content = await response.Content.ReadAsStringAsync(ct);
        await cache.SetAsync(cacheKey, content, ct);
        return content;
    }

    private async Task ThrottleAsync(CancellationToken ct)
    {
        await _throttle.WaitAsync(ct);
        try
        {
            var elapsed = (DateTime.UtcNow - _lastRequest).TotalMilliseconds;
            if (elapsed < MinDelayMs)
                await Task.Delay(TimeSpan.FromMilliseconds(MinDelayMs - elapsed), ct);
            _lastRequest = DateTime.UtcNow;
        }
        finally
        {
            _throttle.Release();
        }
    }

    public static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
        => HttpPolicyExtensions
            .HandleTransientHttpError()
            .OrResult(r => r.StatusCode == HttpStatusCode.TooManyRequests)
            .WaitAndRetryAsync(3, attempt => TimeSpan.FromSeconds(Math.Pow(2, attempt)));
}
