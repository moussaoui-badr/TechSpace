using System.Text.Json;
using TechSpace.Scraper.Output;
using TechSpace.Scraper.Parsing;
using TechSpace.Scraper.Shopify.Models;

namespace TechSpace.Scraper.Mapping;

public class ProductMapper
{
    private int _nextProductId = 1;
    private int _nextVariantId = 1;
    private int _nextDocumentId = 1;
    private int _nextTagId = 1;

    private readonly HashSet<string> _usedProductSlugs = [];
    private readonly HashSet<string> _usedVariantSkus = [];
    private readonly Dictionary<string, TagJson> _tagsBySlug = new(StringComparer.OrdinalIgnoreCase);

    // Valeur sentinelle : l'API publique Shopify signale "available" sans exposer la quantité réelle
    private const int StockAvailableSentinel = 99;

    private static readonly HashSet<string> SoftwareKeywords = new(StringComparer.OrdinalIgnoreCase)
        { "logiciel", "software", "licence", "license", "antivirus", "office", "windows" };

    public (ProductJson product, List<MediaJson> media, List<VariantJson> variants, List<DocumentJson> documents, List<string> tagSlugs)
        Map(ShopifyProduct shopify, int categoryId, int brandId, ParsedBody? parsed, ShopifyProductJs? productJs)
    {
        var slug = SlugSanitizer.Deduplicate(
            string.IsNullOrEmpty(shopify.Handle) ? SlugSanitizer.Sanitize(shopify.Title) : shopify.Handle,
            _usedProductSlugs);

        var defaultVariant = shopify.Variants.FirstOrDefault();
        var price = defaultVariant is not null && decimal.TryParse(
            defaultVariant.Price, System.Globalization.NumberStyles.Any,
            System.Globalization.CultureInfo.InvariantCulture, out var p) ? p : 0m;

        var oldPrice = defaultVariant?.CompareAtPrice is not null && decimal.TryParse(
            defaultVariant.CompareAtPrice, System.Globalization.NumberStyles.Any,
            System.Globalization.CultureInfo.InvariantCulture, out var op) ? op : (decimal?)null;

        if (oldPrice <= price) oldPrice = null;

        // L'API publique Shopify ne donne pas inventory_quantity — on utilise available
        var anyAvailable = shopify.Variants.Any(v => v.Available);
        var totalStock = anyAvailable ? StockAvailableSentinel : 0;

        var mainImage = shopify.Images.OrderBy(i => i.Position).FirstOrDefault()?.Src
            ?? "https://placehold.co/600x600/F5F5F5/162844?text=No+Image";

        var productType = DetectProductType(shopify);
        var description = shopify.BodyHtml;
        var shortDesc = ExtractShortDesc(description);

        // Spec humaines (pour affichage fiche produit)
        var specs = parsed?.Specs.Select(s => new SpecJson
        {
            Group = s.Group,
            Key = s.Key,
            Value = s.Value,
        }).ToList() ?? [];

        var sku = BuildSku(defaultVariant?.Sku, shopify.Id, slug);

        var product = new ProductJson
        {
            Id = _nextProductId++,
            Name = shopify.Title.Trim()[..Math.Min(shopify.Title.Trim().Length, 200)],
            Slug = slug,
            ShortDescription = shortDesc,
            Description = description?.Length > 4000
                ? description[..4000]
                : description ?? string.Empty,
            Sku = sku,
            Price = price,
            OldPrice = oldPrice,
            Stock = totalStock,
            IsActive = true,
            IsFeatured = false,
            MainImage = mainImage[..Math.Min(mainImage.Length, 500)],
            CategoryId = categoryId,
            BrandId = brandId,
            Specifications = specs,
            Rating = 0,
            ReviewCount = 0,
            ProductType = productType,
            ExternalId = shopify.Id,
            SourceUrl = $"https://techspace.ma/products/{shopify.Handle}",
            VendorUrl = parsed?.VendorUrl,
            CreatedAt = shopify.CreatedAt?.ToString("O"),
            UpdatedAt = shopify.UpdatedAt?.ToString("O"),
            PublishedAt = shopify.PublishedAt?.ToString("O"),
        };

        // Media
        var media = MapMedia(product.Id, shopify, productJs);

        // Variantes
        var variants = MapVariants(product.Id, shopify, sku);

        // Documents
        var documents = MapDocuments(product.Id, parsed);

        // Tags
        var tagSlugs = MapTags(shopify.Tags);

        return (product, media, variants, documents, tagSlugs);
    }

    private string BuildSku(string? variantSku, long shopifyId, string slug)
    {
        var base_ = !string.IsNullOrWhiteSpace(variantSku) ? variantSku : $"TS-{shopifyId}";
        base_ = base_[..Math.Min(base_.Length, 58)];

        if (_usedVariantSkus.Add(base_)) return base_;

        for (var i = 2; i < 1000; i++)
        {
            var candidate = $"{base_}-{i}";
            if (_usedVariantSkus.Add(candidate)) return candidate;
        }

        return $"TS-{shopifyId}-{slug[..Math.Min(slug.Length, 20)]}";
    }

    private List<MediaJson> MapMedia(int productId, ShopifyProduct shopify, ShopifyProductJs? productJs)
    {
        var media = new List<MediaJson>();

        if (productJs?.Media is { Count: > 0 })
        {
            for (var i = 0; i < productJs.Media.Count; i++)
            {
                var m = productJs.Media[i];
                var (url, mediaType, posterUrl) = m.MediaType switch
                {
                    "video" => (
                        m.Sources?.FirstOrDefault(s => s.MimeType.Contains("mp4"))?.Url ?? m.Src ?? string.Empty,
                        "Video",
                        m.PreviewImage?.Src),
                    "external_video" => (
                        BuildExternalVideoUrl(m.Host, m.ExternalId),
                        "ExternalVideo",
                        m.PreviewImage?.Src),
                    "model" => (m.Src ?? string.Empty, "Model3D", (string?)null),
                    _ => (m.Src ?? string.Empty, "Image", (string?)null),
                };

                if (string.IsNullOrEmpty(url)) continue;

                media.Add(new MediaJson
                {
                    ProductId = productId,
                    Url = url[..Math.Min(url.Length, 500)],
                    MediaType = mediaType,
                    PosterUrl = posterUrl?[..Math.Min(posterUrl.Length, 500)],
                    Width = m.Width,
                    Height = m.Height,
                    Alt = m.Alt?[..Math.Min(m.Alt.Length, 300)],
                    SortOrder = i,
                });
            }
        }
        else
        {
            for (var i = 0; i < shopify.Images.Count; i++)
            {
                var img = shopify.Images[i];
                media.Add(new MediaJson
                {
                    ProductId = productId,
                    Url = img.Src[..Math.Min(img.Src.Length, 500)],
                    MediaType = "Image",
                    Width = img.Width > 0 ? img.Width : null,
                    Height = img.Height > 0 ? img.Height : null,
                    Alt = img.Alt?[..Math.Min(img.Alt.Length, 300)],
                    SortOrder = i,
                });
            }
        }

        return media;
    }

    private List<VariantJson> MapVariants(int productId, ShopifyProduct shopify, string productSku)
    {
        if (shopify.Variants.Count <= 1) return [];

        var variants = new List<VariantJson>();

        for (var i = 0; i < shopify.Variants.Count; i++)
        {
            var v = shopify.Variants[i];
            decimal.TryParse(v.Price, System.Globalization.NumberStyles.Any,
                System.Globalization.CultureInfo.InvariantCulture, out var vPrice);
            decimal.TryParse(v.CompareAtPrice, System.Globalization.NumberStyles.Any,
                System.Globalization.CultureInfo.InvariantCulture, out var vOldPrice);

            var sku = BuildSku(!string.IsNullOrWhiteSpace(v.Sku) ? v.Sku : $"{productSku}-{i + 1}", v.Id, string.Empty);

            var options = BuildOptionsJson(shopify.Options, v);

            variants.Add(new VariantJson
            {
                Id = _nextVariantId++,
                ProductId = productId,
                Title = v.Title[..Math.Min(v.Title.Length, 200)],
                Sku = sku,
                Price = vPrice,
                OldPrice = vOldPrice > vPrice ? vOldPrice : null,
                Stock = v.Available ? StockAvailableSentinel : 0,
                Barcode = v.Barcode?[..Math.Min(v.Barcode.Length, 30)],
                OptionsJson = options,
                IsDefault = i == 0,
                SortOrder = i,
            });
        }

        return variants;
    }

    private List<DocumentJson> MapDocuments(int productId, ParsedBody? parsed)
    {
        if (parsed?.Documents is null or { Count: 0 }) return [];

        return parsed.Documents.Select(d => new DocumentJson
        {
            Id = _nextDocumentId++,
            ProductId = productId,
            Title = d.Title,
            Url = d.Url,
            DocumentType = d.DocType,
        }).ToList();
    }

    private List<string> MapTags(List<string> tagsList)
    {
        if (tagsList is null or { Count: 0 }) return [];

        var slugs = new List<string>();
        foreach (var raw in tagsList)
        {
            var name = raw.Trim();
            if (string.IsNullOrEmpty(name)) continue;

            var slug = SlugSanitizer.Sanitize(name, 120);
            if (!_tagsBySlug.ContainsKey(slug))
            {
                _tagsBySlug[slug] = new TagJson
                {
                    Id = _nextTagId++,
                    Name = name[..Math.Min(name.Length, 100)],
                    Slug = slug,
                };
            }

            slugs.Add(slug);
        }

        return slugs;
    }

    public List<TagJson> GetAllTags() => [.. _tagsBySlug.Values.OrderBy(t => t.Id)];

    public List<ProductTagLinkJson> BuildTagLinks(int productId, List<string> tagSlugs)
        => tagSlugs
            .Where(s => _tagsBySlug.ContainsKey(s))
            .Select(s => new ProductTagLinkJson { ProductId = productId, TagId = _tagsBySlug[s].Id })
            .ToList();

    private static string DetectProductType(ShopifyProduct shopify)
    {
        var text = $"{shopify.ProductType} {string.Join(' ', shopify.Tags)}".ToLowerInvariant();
        if (SoftwareKeywords.Any(k => text.Contains(k))) return "Software";
        if (text.Contains("digital") || text.Contains("code")) return "Digital";
        return "Physical";
    }

    private static string ExtractShortDesc(string? html)
    {
        if (string.IsNullOrWhiteSpace(html)) return string.Empty;
        var text = System.Text.RegularExpressions.Regex.Replace(html, "<[^>]+>", " ")
            .Replace("&nbsp;", " ").Trim();
        var dot = text.IndexOf('.');
        var short_ = dot > 20 && dot < 400 ? text[..(dot + 1)] : text[..Math.Min(text.Length, 300)];
        return short_[..Math.Min(short_.Length, 500)];
    }

    private static string BuildExternalVideoUrl(string? host, string? externalId)
    {
        if (string.IsNullOrEmpty(externalId)) return string.Empty;
        return host?.ToLowerInvariant() switch
        {
            "youtube" => $"https://www.youtube.com/watch?v={externalId}",
            "vimeo" => $"https://vimeo.com/{externalId}",
            _ => externalId,
        };
    }

    private static string? BuildOptionsJson(List<ShopifyOption> options, ShopifyVariant variant)
    {
        if (options.Count == 0) return null;

        var dict = new Dictionary<string, string>();
        if (options.Count >= 1 && variant.Option1 is not null) dict[options[0].Name] = variant.Option1;
        if (options.Count >= 2 && variant.Option2 is not null) dict[options[1].Name] = variant.Option2;
        if (options.Count >= 3 && variant.Option3 is not null) dict[options[2].Name] = variant.Option3;

        return dict.Count > 0 ? JsonSerializer.Serialize(dict) : null;
    }
}
