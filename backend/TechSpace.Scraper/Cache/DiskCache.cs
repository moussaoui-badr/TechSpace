namespace TechSpace.Scraper.Cache;

public class DiskCache
{
    private readonly string _cacheDir;
    private readonly ILogger<DiskCache> _logger;

    public DiskCache(ILogger<DiskCache> logger) : this(".cache", logger) { }

    public DiskCache(string cacheDir, ILogger<DiskCache> logger)
    {
        _cacheDir = cacheDir;
        _logger = logger;
        Directory.CreateDirectory(_cacheDir);
    }

    public async Task<string?> GetAsync(string key, CancellationToken ct)
    {
        var path = GetPath(key);
        if (!File.Exists(path)) return null;
        try { return await File.ReadAllTextAsync(path, ct); }
        catch (Exception ex)
        {
            _logger.LogDebug("Cache lecture échouée pour {Key} : {Err}", key, ex.Message);
            return null;
        }
    }

    public async Task SetAsync(string key, string content, CancellationToken ct)
    {
        var path = GetPath(key);
        try { await File.WriteAllTextAsync(path, content, ct); }
        catch (Exception ex) { _logger.LogDebug("Cache écriture échouée pour {Key} : {Err}", key, ex.Message); }
    }

    public void Clear()
    {
        if (Directory.Exists(_cacheDir)) Directory.Delete(_cacheDir, recursive: true);
        Directory.CreateDirectory(_cacheDir);
        _logger.LogInformation("Cache vidé.");
    }

    private string GetPath(string key)
    {
        var safe = string.Concat(key.Take(200)).Replace('\\', '_').Replace('/', '_');
        return Path.Combine(_cacheDir, safe + ".json");
    }
}
