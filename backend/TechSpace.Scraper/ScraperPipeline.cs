using TechSpace.Scraper.Mapping;
using TechSpace.Scraper.Output;
using TechSpace.Scraper.Parsing;
using TechSpace.Scraper.Shopify;
using TechSpace.Scraper.Shopify.Models;
using TechSpace.Scraper.Validation;

namespace TechSpace.Scraper;

public class ScraperOptions
{
    public bool DryRun { get; set; }
    public bool SkipMedia { get; set; }
    public bool SkipHtml { get; set; }
    public int MaxProducts { get; set; }
    public bool DownloadAssets { get; set; }
    public string AssetsPath { get; set; } = "assets";
}

public class ScraperPipeline(
    ShopifyClient shopify,
    BrandResolver brandResolver,
    CollectionMapper collectionMapper,
    ProductMapper productMapper,
    BodyHtmlParser htmlParser,
    SpecExtractor specExtractor,
    HeroScraper heroScraper,
    ModelConstraintValidator validator,
    SeedJsonWriter writer,
    ScraperOptions options,
    ILoggerFactory loggerFactory,
    ILogger<ScraperPipeline> logger)
{
    public async Task RunAsync(CancellationToken ct)
    {
        logger.LogInformation("═══════ TechSpace Scraper ═══════");

        // 1. Collections → catégories
        logger.LogInformation("Étape 1/5 : récupération des collections...");
        var shopifyCollections = await shopify.GetAllCollectionsAsync(ct);
        var categories = collectionMapper.Map(shopifyCollections);
        var categoriesFlat = Flatten(categories);
        logger.LogInformation("{Count} catégories mappées.", categoriesFlat.Count);

        // 2. Produits
        logger.LogInformation("Étape 2/5 : récupération de tous les produits...");
        var allProducts = await shopify.GetAllProductsAsync(ct);
        var deduped = allProducts.GroupBy(p => p.Id).Select(g => g.First()).ToList();

        if (options.MaxProducts > 0 && deduped.Count > options.MaxProducts)
        {
            logger.LogInformation("Limite à {Max} produits (sur {Total}).", options.MaxProducts, deduped.Count);
            deduped = deduped[..options.MaxProducts];
        }

        // Association produit → categoryId via les collections
        var productCategories = await BuildProductCategoryMapAsync(shopifyCollections, categoriesFlat, ct);

        logger.LogInformation("{Count} produits uniques à traiter.", deduped.Count);

        var bundle = new SeedBundle { Categories = categories };
        var mediaList = new List<MediaJson>();
        var variantList = new List<VariantJson>();
        var documentList = new List<DocumentJson>();
        var tagLinkList = new List<ProductTagLinkJson>();
        var productAttrList = new List<ProductAttributeValueJson>();

        // 3. Enrichissement
        logger.LogInformation("Étape 3/5 : enrichissement des produits...");

        for (var idx = 0; idx < deduped.Count; idx++)
        {
            ct.ThrowIfCancellationRequested();
            var sp = deduped[idx];

            if (idx % 50 == 0)
                logger.LogInformation("  [{Done}/{Total}] traitement en cours...", idx, deduped.Count);

            var brand = brandResolver.Resolve(sp.Vendor);
            var categoryId = productCategories.TryGetValue(sp.Id, out var cats) && cats.Count > 0
                ? cats[0]
                : categoriesFlat.FirstOrDefault()?.Id ?? 1;

            ParsedBody? parsed = null;
            if (!options.SkipHtml && !string.IsNullOrWhiteSpace(sp.BodyHtml))
            {
                try { parsed = await htmlParser.ParseAsync(sp.BodyHtml, ct); }
                catch (Exception ex) { logger.LogDebug("HTML parse failed {Handle}: {Err}", sp.Handle, ex.Message); }
            }

            ShopifyProductJs? productJs = null;
            if (!options.SkipMedia)
            {
                try { productJs = await shopify.GetProductJsAsync(sp.Handle, ct); }
                catch (Exception ex) { logger.LogDebug("ProductJs failed {Handle}: {Err}", sp.Handle, ex.Message); }
            }

            var (product, media, variants, documents, tagSlugs) =
                productMapper.Map(sp, categoryId, brand.Id, parsed, productJs);

            bundle.Products.Add(product);
            mediaList.AddRange(media);
            variantList.AddRange(variants);
            documentList.AddRange(documents);
            tagLinkList.AddRange(productMapper.BuildTagLinks(product.Id, tagSlugs));

            if (parsed?.Specs is { Count: > 0 })
            {
                foreach (var spec in parsed.Specs)
                    specExtractor.Observe(spec.Key, spec.Value);

                foreach (var spec in parsed.Specs)
                {
                    var av = specExtractor.ToAttributeValue(product.Id, spec.Key, spec.Value);
                    if (av is not null) productAttrList.Add(av);
                }
            }
        }

        // 4. Hero
        logger.LogInformation("Étape 4/5 : extraction du hero...");
        try
        {
            var homeHtml = await shopify.GetHomeHtmlAsync(ct);
            bundle.Banners = await heroScraper.ExtractBannersAsync(homeHtml, ct);
        }
        catch (Exception ex)
        {
            logger.LogWarning("Hero extraction failed: {Err}. Bannières placeholder.", ex.Message);
            bundle.Banners = [DefaultBanner()];
        }

        // 5. Consolidation + validation + écriture
        logger.LogInformation("Étape 5/5 : consolidation...");
        bundle.Brands = brandResolver.GetAll();
        bundle.Media = mediaList;
        bundle.Variants = variantList;
        bundle.Documents = documentList;
        bundle.SpecAttributes = specExtractor.GetAttributes();
        bundle.ProductAttributes = productAttrList
            .GroupBy(a => (a.ProductId, a.AttributeId))
            .Select(g => g.First())
            .ToList();
        bundle.Tags = productMapper.GetAllTags();
        bundle.ProductTagLinks = tagLinkList;
        bundle.Reviews = [];

        // Téléchargement des assets (images + documents) si demandé
        if (options.DownloadAssets && !options.DryRun)
        {
            logger.LogInformation("Téléchargement des assets (images + documents)...");
            var absAssets = Path.IsPathRooted(options.AssetsPath)
                ? options.AssetsPath
                : Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, options.AssetsPath));

            var downloader = new AssetDownloader(shopify, absAssets,
                loggerFactory.CreateLogger<AssetDownloader>());

            bundle.Media = await downloader.DownloadMediaAsync(bundle.Media, ct);
            bundle.Documents = await downloader.DownloadDocumentsAsync(bundle.Documents, ct);
        }

        validator.Validate(bundle);
        await writer.WriteAllAsync(bundle, options.DryRun, ct);

        if (!options.DryRun)
        {
            logger.LogInformation("Seed généré. Prochaines étapes :");
            logger.LogInformation("  dotnet ef database drop -f && dotnet ef database update && dotnet run");
        }
    }

    private async Task<Dictionary<long, List<int>>> BuildProductCategoryMapAsync(
        List<ShopifyCollection> collections, List<CategoryJson> flat, CancellationToken ct)
    {
        var map = new Dictionary<long, List<int>>();

        foreach (var col in collections)
        {
            ct.ThrowIfCancellationRequested();
            var catId = FindCategoryId(col.Handle, col.Title, flat);
            if (catId == 0) continue;

            List<ShopifyProduct> colProducts;
            try { colProducts = await shopify.GetProductsByCollectionAsync(col.Handle, ct); }
            catch { continue; }

            foreach (var p in colProducts)
            {
                if (!map.TryGetValue(p.Id, out var list)) map[p.Id] = list = [];
                if (!list.Contains(catId)) list.Add(catId);
            }
        }

        return map;
    }

    private static int FindCategoryId(string handle, string title, List<CategoryJson> flat)
    {
        var exact = flat.FirstOrDefault(c => c.Slug.Equals(handle, StringComparison.OrdinalIgnoreCase));
        if (exact is not null) return exact.Id;
        var approx = flat.FirstOrDefault(c => c.Name.Equals(title.Trim(), StringComparison.OrdinalIgnoreCase));
        return approx?.Id ?? 0;
    }

    private static List<CategoryJson> Flatten(List<CategoryJson> categories)
    {
        var result = new List<CategoryJson>();
        foreach (var c in categories) { result.Add(c); result.AddRange(c.Children); }
        return result;
    }

    private static BannerJson DefaultBanner() => new()
    {
        Id = 1,
        Title = "Bienvenue sur TechSpace",
        Subtitle = "Le matériel informatique au meilleur prix au Maroc",
        ImageUrl = "https://placehold.co/1920x600/162844/FFFFFF?text=TechSpace",
        LinkUrl = "/products",
        CtaLabel = "Voir le catalogue",
        IsActive = true,
    };
}
