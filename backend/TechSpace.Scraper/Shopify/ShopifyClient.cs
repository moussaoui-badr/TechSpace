using System.Net;
using System.Text.Json;
using Polly;
using Polly.Extensions.Http;
using TechSpace.Scraper.Cache;
using TechSpace.Scraper.Shopify.Models;

namespace TechSpace.Scraper.Shopify;

public class ShopifyClient(HttpClient http, DiskCache cache, ILogger<ShopifyClient> logger)
{
    private static readonly JsonSerializerOptions Json = new() { PropertyNameCaseInsensitive = true };

    private readonly SemaphoreSlim _throttle = new(1, 1);
    private DateTime _lastRequest = DateTime.MinValue;
    private const int MinDelayMs = 400; // ~2.5 req/s

    public async Task<List<ShopifyCollection>> GetAllCollectionsAsync(CancellationToken ct)
    {
        var result = await PaginateAsync<ShopifyCollectionsResponse, ShopifyCollection>(
            "/collections.json?limit=250", r => r.Collections, ct);
        logger.LogInformation("Collections récupérées : {Count}", result.Count);
        return result;
    }

    public async Task<List<ShopifyProduct>> GetProductsByCollectionAsync(string collectionHandle, CancellationToken ct)
        => await PaginateAsync<ShopifyProductsResponse, ShopifyProduct>(
            $"/collections/{collectionHandle}/products.json?limit=250", r => r.Products, ct);

    public async Task<List<ShopifyProduct>> GetAllProductsAsync(CancellationToken ct)
    {
        var result = await PaginateAsync<ShopifyProductsResponse, ShopifyProduct>(
            "/products.json?limit=250", r => r.Products, ct);
        logger.LogInformation("Produits récupérés : {Count}", result.Count);
        return result;
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
            logger.LogDebug("ProductJs introuvable pour {Handle} : {Err}", handle, ex.Message);
            return null;
        }
    }

    public async Task<string> GetHomeHtmlAsync(CancellationToken ct)
        => await FetchAsync("/", ct);

    // Throttle dédié au CDN (séparé du throttle API) : 8 téléchargements parallèles
    private readonly SemaphoreSlim _cdnThrottle = new(8, 8);

    public async Task<byte[]?> DownloadBytesAsync(string url, CancellationToken ct)
    {
        await _cdnThrottle.WaitAsync(ct);
        try
        {
            using var response = await http.GetAsync(url, ct);
            if (!response.IsSuccessStatusCode) return null;
            return await response.Content.ReadAsByteArrayAsync(ct);
        }
        catch (Exception ex)
        {
            logger.LogDebug("Download CDN échoué {Url} : {Err}", url, ex.Message);
            return null;
        }
        finally { _cdnThrottle.Release(); }
    }

    private async Task<List<TItem>> PaginateAsync<TResponse, TItem>(
        string urlPath, Func<TResponse, List<TItem>> getItems, CancellationToken ct)
    {
        var all = new List<TItem>();
        var page = 1;

        while (true)
        {
            var sep = urlPath.Contains('?') ? "&" : "?";
            var paged = $"{urlPath}{sep}page={page}";

            string json;
            try { json = await FetchAsync(paged, ct); }
            catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                logger.LogDebug("404 sur {Url} — fin de pagination.", paged);
                break;
            }

            var response = JsonSerializer.Deserialize<TResponse>(json, Json);
            if (response is null) break;

            var items = getItems(response);
            if (items.Count == 0) break;

            all.AddRange(items);

            // Shopify renvoie toujours 250 items maximum par page
            if (items.Count < 250) break;
            page++;
        }

        return all;
    }

    private async Task<string> FetchAsync(string path, CancellationToken ct)
    {
        var cacheKey = path.Replace('/', '_').Replace('?', '-').Replace('&', '-').TrimStart('_');
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
        finally { _throttle.Release(); }
    }

    public static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
        => HttpPolicyExtensions
            .HandleTransientHttpError()
            .OrResult(r => r.StatusCode == HttpStatusCode.TooManyRequests)
            .WaitAndRetryAsync(3, attempt => TimeSpan.FromSeconds(Math.Pow(2, attempt)));
}
