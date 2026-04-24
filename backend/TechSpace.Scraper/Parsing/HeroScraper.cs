using AngleSharp;
using TechSpace.Scraper.Output;

namespace TechSpace.Scraper.Parsing;

public class HeroScraper(ILogger<HeroScraper> logger)
{
    private static readonly AngleSharp.IConfiguration Config = AngleSharp.Configuration.Default;

    public async Task<List<BannerJson>> ExtractBannersAsync(string html, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(html)) return [];

        using var context = BrowsingContext.New(Config);
        using var doc = await context.OpenAsync(req => req.Content(html), ct);

        var banners = new List<BannerJson>();

        // Sélecteurs courants pour les héros Shopify
        var heroSelectors = new[]
        {
            "[class*='hero'] [class*='slide']",
            "[class*='slideshow'] [class*='slide']",
            "[class*='banner'] [class*='slide']",
            "[class*='hero-slide']",
            "[class*='slider-item']",
            "[class*='carousel-item']",
        };

        foreach (var selector in heroSelectors)
        {
            var slides = doc.QuerySelectorAll(selector).ToList();
            if (slides.Count == 0) continue;

            logger.LogInformation("Hero trouvé via sélecteur '{Sel}' : {Count} slides", selector, slides.Count);

            for (var i = 0; i < slides.Count && banners.Count < 8; i++)
            {
                var slide = slides[i];

                var imgEl = slide.QuerySelector("img");
                var imageUrl = imgEl?.GetAttribute("src")
                    ?? imgEl?.GetAttribute("data-src")
                    ?? string.Empty;

                if (imageUrl.StartsWith("//")) imageUrl = "https:" + imageUrl;

                var title = slide.QuerySelector("h1, h2, [class*='title'], [class*='heading']")?.TextContent.Trim()
                    ?? $"Bannière {i + 1}";

                var subtitle = slide.QuerySelector("p, [class*='subtitle'], [class*='desc']")?.TextContent.Trim();

                var ctaEl = slide.QuerySelector("a[href]");
                var linkUrl = ctaEl?.GetAttribute("href");
                var ctaLabel = ctaEl?.TextContent.Trim();

                var videoEl = slide.QuerySelector("video source");
                var videoUrl = videoEl?.GetAttribute("src");

                banners.Add(new BannerJson
                {
                    Id = i + 1,
                    Title = title[..Math.Min(title.Length, 200)],
                    Subtitle = subtitle?[..Math.Min(subtitle.Length, 500)],
                    ImageUrl = string.IsNullOrEmpty(imageUrl) ? "https://placehold.co/1920x600/162844/FFFFFF?text=Hero" : imageUrl[..Math.Min(imageUrl.Length, 500)],
                    VideoUrl = videoUrl?[..Math.Min(videoUrl.Length, 500)],
                    LinkUrl = linkUrl?[..Math.Min(linkUrl.Length, 500)],
                    CtaLabel = ctaLabel?[..Math.Min(ctaLabel.Length, 100)],
                    IsActive = true,
                });
            }

            if (banners.Count > 0) break;
        }

        // Fallback : chercher des images de fond dans les sections hero
        if (banners.Count == 0)
        {
            foreach (var section in doc.QuerySelectorAll("[class*='hero'], [class*='banner-section'], section.featured"))
            {
                var style = section.GetAttribute("style") ?? string.Empty;
                var bgMatch = System.Text.RegularExpressions.Regex.Match(style, @"background-image:\s*url\(['""]?([^'"")]+)['""]?\)");
                var imageUrl = bgMatch.Success ? bgMatch.Groups[1].Value : string.Empty;

                if (imageUrl.StartsWith("//")) imageUrl = "https:" + imageUrl;

                var title = section.QuerySelector("h1, h2")?.TextContent.Trim() ?? "Hero";
                banners.Add(new BannerJson
                {
                    Id = banners.Count + 1,
                    Title = title[..Math.Min(title.Length, 200)],
                    ImageUrl = string.IsNullOrEmpty(imageUrl)
                        ? "https://placehold.co/1920x600/162844/FFFFFF?text=Hero"
                        : imageUrl[..Math.Min(imageUrl.Length, 500)],
                    IsActive = true,
                });

                if (banners.Count >= 4) break;
            }
        }

        if (banners.Count == 0)
        {
            logger.LogWarning("Aucun hero détecté dans la page d'accueil — bannières placeholder générées.");
            banners.Add(new BannerJson
            {
                Id = 1,
                Title = "Bienvenue sur TechSpace",
                Subtitle = "Le matériel informatique au meilleur prix au Maroc",
                ImageUrl = "https://placehold.co/1920x600/162844/FFFFFF?text=TechSpace",
                LinkUrl = "/products",
                CtaLabel = "Voir le catalogue",
                IsActive = true,
            });
        }

        return banners;
    }
}
