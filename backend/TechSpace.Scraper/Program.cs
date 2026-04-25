using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TechSpace.Scraper;
using TechSpace.Scraper.Cache;
using TechSpace.Scraper.Mapping;
using TechSpace.Scraper.Output;
using TechSpace.Scraper.Parsing;
using TechSpace.Scraper.Shopify;
using TechSpace.Scraper.Validation;

var dryRun = args.Contains("--dry-run");
var verbose = args.Contains("--verbose");
var clearCache = args.Contains("--clear-cache");
var skipMedia = args.Contains("--skip-media");
var downloadAssets = args.Contains("--download-assets");
var assetsPathArg = args.SkipWhile(a => a != "--assets-path").Skip(1).FirstOrDefault();

var host = Host.CreateDefaultBuilder(args)
    .ConfigureAppConfiguration((_, cfg) => cfg.AddJsonFile("appsettings.json", optional: false))
    .ConfigureLogging(log =>
    {
        log.ClearProviders();
        log.AddConsole();
        log.SetMinimumLevel(verbose ? LogLevel.Debug : LogLevel.Information);
    })
    .ConfigureServices((ctx, services) =>
    {
        var config = ctx.Configuration;
        var baseUrl = config["Scraper:BaseUrl"] ?? "https://techspace.ma";
        var outputPath = config["Scraper:OutputPath"] ?? "../TechSpace.Api/SeedData";
        var cachePath = config["Scraper:CachePath"] ?? ".cache";

        var absOutput = Path.IsPathRooted(outputPath)
            ? outputPath
            : Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, outputPath));

        services.AddSingleton(sp =>
            new DiskCache(cachePath, sp.GetRequiredService<ILogger<DiskCache>>()));

        services.AddHttpClient<ShopifyClient>(client =>
        {
            client.BaseAddress = new Uri(baseUrl);
            client.DefaultRequestHeaders.UserAgent.ParseAdd("TechSpaceSeeder/1.0 (+contact@techspace.local)");
            client.Timeout = TimeSpan.FromSeconds(30);
        }).AddPolicyHandler(ShopifyClient.GetRetryPolicy());

        services.AddSingleton<BrandResolver>();
        services.AddSingleton<CollectionMapper>();
        services.AddSingleton<ProductMapper>();
        services.AddSingleton(new BodyHtmlParser());
        services.AddSingleton<SpecExtractor>();
        services.AddSingleton<HeroScraper>();
        services.AddSingleton<ModelConstraintValidator>();
        services.AddSingleton(sp =>
            new SeedJsonWriter(absOutput, sp.GetRequiredService<ILogger<SeedJsonWriter>>()));

        services.AddSingleton(new ScraperOptions
        {
            DryRun = dryRun,
            SkipMedia = skipMedia || config["Scraper:SkipMedia"] == "true",
            SkipHtml = config["Scraper:SkipHtml"] == "true",
            MaxProducts = int.TryParse(config["Scraper:MaxProductsPerRun"], out var max) ? max : 0,
            DownloadAssets = downloadAssets,
            AssetsPath = assetsPathArg ?? config["Scraper:AssetsPath"] ?? "../TechSpace.Api/SeedData/assets",
        });

        services.AddSingleton<ScraperPipeline>();
    })
    .Build();

if (clearCache) host.Services.GetRequiredService<DiskCache>().Clear();

var logger = host.Services.GetRequiredService<ILogger<Program>>();
if (dryRun) logger.LogInformation("Mode DRY RUN — aucun fichier ne sera écrit.");

try
{
    var pipeline = host.Services.GetRequiredService<ScraperPipeline>();
    using var cts = new CancellationTokenSource();
    Console.CancelKeyPress += (_, e) => { e.Cancel = true; cts.Cancel(); };
    await pipeline.RunAsync(cts.Token);
}
catch (OperationCanceledException)
{
    logger.LogInformation("Scraper interrompu.");
}
catch (Exception ex)
{
    logger.LogError(ex, "Erreur fatale.");
    return 1;
}

return 0;
