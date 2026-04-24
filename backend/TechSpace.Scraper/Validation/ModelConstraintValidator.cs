using TechSpace.Scraper.Output;

namespace TechSpace.Scraper.Validation;

public class ModelConstraintValidator(ILogger<ModelConstraintValidator> logger)
{
    public void Validate(SeedBundle bundle)
    {
        var errors = new List<string>();

        // Vérification des FKs produit → catégorie/brand
        var categoryIds = bundle.Categories
            .SelectMany(c => new[] { c.Id }.Concat(c.Children.Select(ch => ch.Id)))
            .ToHashSet();
        var brandIds = bundle.Brands.Select(b => b.Id).ToHashSet();

        foreach (var p in bundle.Products)
        {
            if (!categoryIds.Contains(p.CategoryId))
                errors.Add($"Produit {p.Id} ({p.Slug}): categoryId={p.CategoryId} introuvable.");
            if (!brandIds.Contains(p.BrandId))
                errors.Add($"Produit {p.Id} ({p.Slug}): brandId={p.BrandId} introuvable.");
        }

        // Unicité slugs produits
        var productSlugs = bundle.Products.GroupBy(p => p.Slug).Where(g => g.Count() > 1);
        foreach (var g in productSlugs)
            errors.Add($"Slug produit dupliqué : '{g.Key}' ({g.Count()} fois).");

        // Unicité SKUs (produits + variantes)
        var allSkus = bundle.Products.Select(p => p.Sku)
            .Concat(bundle.Variants.Select(v => v.Sku))
            .GroupBy(s => s).Where(g => g.Count() > 1);
        foreach (var g in allSkus)
            errors.Add($"SKU dupliqué : '{g.Key}'.");

        // Unicité slugs catégories
        var catSlugs = bundle.Categories
            .SelectMany(c => new[] { c.Slug }.Concat(c.Children.Select(ch => ch.Slug)))
            .GroupBy(s => s).Where(g => g.Count() > 1);
        foreach (var g in catSlugs)
            errors.Add($"Slug catégorie dupliqué : '{g.Key}'.");

        // Longueurs maximales critiques
        foreach (var p in bundle.Products)
        {
            if (p.Name.Length > 200) { p.Name = p.Name[..200]; logger.LogDebug("Nom tronqué : {Slug}", p.Slug); }
            if (p.Slug.Length > 220) { errors.Add($"Slug trop long : {p.Slug}"); }
            if (p.Sku.Length > 60) { p.Sku = p.Sku[..60]; }
            if (p.Description?.Length > 4000) p.Description = p.Description[..4000];
            if (p.ShortDescription?.Length > 500) p.ShortDescription = p.ShortDescription[..500];
        }

        if (errors.Count > 0)
        {
            logger.LogWarning("{Count} problème(s) de validation :", errors.Count);
            foreach (var e in errors) logger.LogWarning("  ⚠ {Error}", e);
        }
        else
        {
            logger.LogInformation("Validation OK — aucun problème détecté.");
        }
    }
}
