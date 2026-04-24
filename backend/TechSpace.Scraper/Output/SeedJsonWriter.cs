using System.Text.Json;

namespace TechSpace.Scraper.Output;

public class SeedJsonWriter(string outputDir, ILogger<SeedJsonWriter> logger)
{
    private static readonly JsonSerializerOptions Json = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
    };

    public async Task WriteAllAsync(SeedBundle bundle, bool dryRun, CancellationToken ct)
    {
        if (dryRun)
        {
            LogReport(bundle);
            return;
        }

        BackupExisting();
        Directory.CreateDirectory(outputDir);

        await WriteAsync("brands.json", bundle.Brands, ct);
        await WriteAsync("categories.json", bundle.Categories, ct);
        await WriteAsync("products.json", bundle.Products, ct);
        await WriteAsync("media.json", bundle.Media, ct);
        await WriteAsync("variants.json", bundle.Variants, ct);
        await WriteAsync("documents.json", bundle.Documents, ct);
        await WriteAsync("spec-attributes.json", bundle.SpecAttributes, ct);
        await WriteAsync("product-attributes.json", bundle.ProductAttributes, ct);
        await WriteAsync("tags.json", bundle.Tags, ct);
        await WriteAsync("product-tags.json", bundle.ProductTagLinks, ct);
        await WriteAsync("banners.json", bundle.Banners, ct);
        await WriteAsync("reviews.json", bundle.Reviews, ct);

        LogReport(bundle);
        logger.LogInformation("Seed écrit dans {Dir}", outputDir);
    }

    private async Task WriteAsync<T>(string filename, T data, CancellationToken ct)
    {
        var path = Path.Combine(outputDir, filename);
        await using var stream = File.Create(path);
        await JsonSerializer.SerializeAsync(stream, data, Json, ct);
        logger.LogDebug("Écrit : {File}", filename);
    }

    private void BackupExisting()
    {
        if (!Directory.Exists(outputDir)) return;

        var backup = Path.Combine(outputDir, $".backup-{DateTime.Now:yyyyMMdd-HHmmss}");
        Directory.CreateDirectory(backup);

        foreach (var file in Directory.GetFiles(outputDir, "*.json"))
        {
            File.Copy(file, Path.Combine(backup, Path.GetFileName(file)), overwrite: true);
        }

        logger.LogInformation("Backup créé dans {Backup}", backup);
    }

    private void LogReport(SeedBundle bundle)
    {
        logger.LogInformation("═══════ Rapport du scraper ═══════");
        logger.LogInformation("  brands          : {N}", bundle.Brands.Count);
        logger.LogInformation("  categories      : {N}", bundle.Categories.Sum(c => 1 + c.Children.Count));
        logger.LogInformation("  products        : {N}", bundle.Products.Count);
        logger.LogInformation("  media           : {N}", bundle.Media.Count);
        logger.LogInformation("  variants        : {N}", bundle.Variants.Count);
        logger.LogInformation("  documents       : {N}", bundle.Documents.Count);
        logger.LogInformation("  spec-attributes : {N}", bundle.SpecAttributes.Count);
        logger.LogInformation("  product-attrs   : {N}", bundle.ProductAttributes.Count);
        logger.LogInformation("  tags            : {N}", bundle.Tags.Count);
        logger.LogInformation("  banners         : {N}", bundle.Banners.Count);
        logger.LogInformation("  reviews         : {N}", bundle.Reviews.Count);
        logger.LogInformation("══════════════════════════════════");
    }
}

public class SeedBundle
{
    public List<BrandJson> Brands { get; set; } = [];
    public List<CategoryJson> Categories { get; set; } = [];
    public List<ProductJson> Products { get; set; } = [];
    public List<MediaJson> Media { get; set; } = [];
    public List<VariantJson> Variants { get; set; } = [];
    public List<DocumentJson> Documents { get; set; } = [];
    public List<SpecAttributeJson> SpecAttributes { get; set; } = [];
    public List<ProductAttributeValueJson> ProductAttributes { get; set; } = [];
    public List<TagJson> Tags { get; set; } = [];
    public List<ProductTagLinkJson> ProductTagLinks { get; set; } = [];
    public List<BannerJson> Banners { get; set; } = [];
    public List<ReviewJson> Reviews { get; set; } = [];
}
