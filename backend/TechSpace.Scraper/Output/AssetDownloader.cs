using System.Security.Cryptography;
using TechSpace.Scraper.Shopify;

namespace TechSpace.Scraper.Output;

public class AssetDownloader(
    ShopifyClient http,
    string assetsDir,
    ILogger<AssetDownloader> logger)
{
    private int _downloaded;
    private int _cacheHit;
    private int _failed;

    public async Task<List<MediaJson>> DownloadMediaAsync(List<MediaJson> media, CancellationToken ct)
    {
        var imagesDir = Path.Combine(assetsDir, "images");
        Directory.CreateDirectory(imagesDir);

        var result = new List<MediaJson>(media.Count);

        foreach (var m in media)
        {
            ct.ThrowIfCancellationRequested();

            // Télécharger uniquement les images (pas les vidéos embed YouTube/Vimeo)
            if (m.MediaType is not ("Image" or "Video"))
            {
                result.Add(m);
                continue;
            }

            var localPath = await DownloadFileAsync(m.Url, imagesDir, ct);
            if (localPath is not null)
            {
                m.Url = localPath;
            }

            result.Add(m);
        }

        logger.LogInformation("Assets images : {Ok} téléchargés, {Cached} depuis cache, {Fail} en échec.", _downloaded, _cacheHit, _failed);
        return result;
    }

    public async Task<List<DocumentJson>> DownloadDocumentsAsync(List<DocumentJson> documents, CancellationToken ct)
    {
        var docsDir = Path.Combine(assetsDir, "documents");
        Directory.CreateDirectory(docsDir);

        var result = new List<DocumentJson>(documents.Count);

        foreach (var doc in documents)
        {
            ct.ThrowIfCancellationRequested();

            var localPath = await DownloadFileAsync(doc.Url, docsDir, ct);
            if (localPath is not null)
            {
                doc.Url = localPath;
                logger.LogInformation("Document téléchargé : {Title}", doc.Title);
            }

            result.Add(doc);
        }

        return result;
    }

    private async Task<string?> DownloadFileAsync(string url, string targetDir, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(url) || !url.StartsWith("http")) return null;

        try
        {
            var fileName = BuildSafeFileName(url);
            var filePath = Path.Combine(targetDir, fileName);

            if (File.Exists(filePath))
            {
                _cacheHit++;
                return $"assets/{Path.GetRelativePath(assetsDir, filePath).Replace('\\', '/')}";
            }

            var bytes = await http.DownloadBytesAsync(url, ct);
            if (bytes is null or { Length: 0 })
            {
                _failed++;
                return null;
            }

            await File.WriteAllBytesAsync(filePath, bytes, ct);
            _downloaded++;
            return $"assets/{Path.GetRelativePath(assetsDir, filePath).Replace('\\', '/')}";
        }
        catch (Exception ex)
        {
            logger.LogDebug("Téléchargement échoué {Url} : {Err}", url, ex.Message);
            _failed++;
            return null;
        }
    }

    private static string BuildSafeFileName(string url)
    {
        var uri = new Uri(url);
        var path = uri.AbsolutePath;
        var fileName = Path.GetFileName(path.Split('?')[0]);

        // Hash SHA1 déterministe (GetHashCode est aléatoire par process en .NET 5+)
        var hash = Convert.ToHexString(SHA1.HashData(System.Text.Encoding.UTF8.GetBytes(url)))[..16].ToLowerInvariant();

        if (string.IsNullOrEmpty(fileName) || fileName.Length < 3)
            fileName = hash;
        else
        {
            var name = Path.GetFileNameWithoutExtension(fileName);
            var ext = Path.GetExtension(fileName);
            fileName = $"{name[..Math.Min(name.Length, 50)]}_{hash}{ext}";
        }

        // Nettoyer les caractères interdits
        return string.Concat(fileName.Select(c => Path.GetInvalidFileNameChars().Contains(c) ? '_' : c));
    }
}
