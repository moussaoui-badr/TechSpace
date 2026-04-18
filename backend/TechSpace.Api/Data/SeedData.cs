using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using TechSpace.Api.Models;

namespace TechSpace.Api.Data;

public static class SeedData
{
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter() },
    };

    public static async Task SeedAsync(AppDbContext db, IWebHostEnvironment env, ILogger logger, CancellationToken ct = default)
    {
        if (await db.Products.AnyAsync(ct))
        {
            logger.LogInformation("Seed ignore : la base contient deja des produits.");
            return;
        }

        var seedDir = Path.Combine(env.ContentRootPath, "SeedData");
        if (!Directory.Exists(seedDir))
        {
            logger.LogWarning("Dossier SeedData introuvable : {Dir}", seedDir);
            return;
        }

        logger.LogInformation("Chargement du seed depuis {Dir}...", seedDir);

        var brands = await LoadAsync<List<BrandJson>>(seedDir, "brands.json", ct);
        var categories = await LoadAsync<List<CategoryJson>>(seedDir, "categories.json", ct);
        var products = await LoadAsync<List<ProductJson>>(seedDir, "products.json", ct);
        var banners = await LoadAsync<List<BannerJson>>(seedDir, "banners.json", ct);
        var reviews = await LoadAsync<List<ReviewJson>>(seedDir, "reviews.json", ct);

        await InsertBrandsAsync(db, brands, ct);
        await InsertCategoriesAsync(db, categories, ct);
        await InsertProductsAsync(db, products, ct);
        await InsertBannersAsync(db, banners, ct);
        await InsertReviewsAsync(db, reviews, ct);

        logger.LogInformation(
            "Seed OK : {B} brands, {C} categories (flat), {P} produits, {Bn} banners, {R} reviews.",
            brands.Count,
            categories.Sum(c => 1 + c.Children.Count),
            products.Count,
            banners.Count,
            reviews.Count);
    }

    private static async Task<T> LoadAsync<T>(string dir, string file, CancellationToken ct)
    {
        var path = Path.Combine(dir, file);
        await using var stream = File.OpenRead(path);
        var data = await JsonSerializer.DeserializeAsync<T>(stream, JsonOpts, ct);
        return data ?? throw new InvalidOperationException($"JSON seed vide : {file}");
    }

    private static async Task InsertBrandsAsync(AppDbContext db, List<BrandJson> brands, CancellationToken ct)
    {
        var entities = brands.Select(b => new Brand
        {
            Id = b.Id,
            Name = b.Name,
            Slug = b.Slug,
            LogoUrl = b.LogoUrl,
        }).ToList();

        await BulkInsertWithIdentityAsync(db, "Brands", entities, ct);
    }

    private static async Task InsertCategoriesAsync(AppDbContext db, List<CategoryJson> tree, CancellationToken ct)
    {
        var entities = new List<Category>();
        foreach (var parent in tree)
        {
            entities.Add(new Category
            {
                Id = parent.Id,
                Name = parent.Name,
                Slug = parent.Slug,
                Description = parent.Description,
                ImageUrl = parent.ImageUrl,
                ParentId = null,
            });
            foreach (var child in parent.Children)
            {
                entities.Add(new Category
                {
                    Id = child.Id,
                    Name = child.Name,
                    Slug = child.Slug,
                    Description = child.Description,
                    ImageUrl = child.ImageUrl,
                    ParentId = parent.Id,
                });
            }
        }

        await BulkInsertWithIdentityAsync(db, "Categories", entities, ct);
    }

    private static async Task InsertProductsAsync(AppDbContext db, List<ProductJson> products, CancellationToken ct)
    {
        var entities = products.Select(p => new Product
        {
            Id = p.Id,
            Name = p.Name,
            Slug = p.Slug,
            ShortDescription = p.ShortDescription ?? string.Empty,
            Description = p.Description ?? string.Empty,
            Sku = p.Sku,
            Price = p.Price,
            OldPrice = p.OldPrice,
            Stock = p.Stock,
            IsActive = p.IsActive,
            IsFeatured = p.IsFeatured,
            MainImage = p.MainImage,
            CategoryId = p.CategoryId,
            BrandId = p.BrandId,
            Rating = p.Rating,
            ReviewCount = p.ReviewCount,
            CreatedAt = DateTime.TryParse(p.CreatedAt, out var dt) ? dt.ToUniversalTime() : DateTime.UtcNow,
        }).ToList();

        await BulkInsertWithIdentityAsync(db, "Products", entities, ct);

        var images = new List<ProductImage>();
        var specs = new List<ProductSpecification>();

        foreach (var p in products)
        {
            for (var i = 0; i < p.Images.Count; i++)
            {
                images.Add(new ProductImage
                {
                    ProductId = p.Id,
                    Url = p.Images[i],
                    SortOrder = i,
                });
            }

            for (var i = 0; i < p.Specifications.Count; i++)
            {
                var spec = p.Specifications[i];
                specs.Add(new ProductSpecification
                {
                    ProductId = p.Id,
                    Group = spec.Group,
                    Key = spec.Key,
                    Value = spec.Value,
                    SortOrder = i,
                });
            }
        }

        db.ProductImages.AddRange(images);
        db.ProductSpecifications.AddRange(specs);
        await db.SaveChangesAsync(ct);
    }

    private static async Task InsertBannersAsync(AppDbContext db, List<BannerJson> banners, CancellationToken ct)
    {
        var entities = new List<Banner>();
        for (var i = 0; i < banners.Count; i++)
        {
            var b = banners[i];
            entities.Add(new Banner
            {
                Id = b.Id,
                Title = b.Title,
                Subtitle = b.Subtitle,
                ImageUrl = b.ImageUrl,
                LinkUrl = b.LinkUrl,
                CtaLabel = b.CtaLabel,
                IsActive = b.IsActive,
                SortOrder = i,
            });
        }

        await BulkInsertWithIdentityAsync(db, "Banners", entities, ct);
    }

    private static async Task InsertReviewsAsync(AppDbContext db, List<ReviewJson> reviews, CancellationToken ct)
    {
        var entities = reviews.Select(r => new Review
        {
            Id = r.Id,
            ProductId = r.ProductId,
            UserName = r.UserName,
            Rating = r.Rating,
            Comment = r.Comment,
            CreatedAt = DateTime.TryParse(r.CreatedAt, out var dt) ? dt.ToUniversalTime() : DateTime.UtcNow,
        }).ToList();

        await BulkInsertWithIdentityAsync(db, "Reviews", entities, ct);
    }

    /// <summary>
    /// Insere en preservant les IDs (IDENTITY_INSERT ON pour SQL Server).
    /// Necessaire pour garder la coherence entre les mock data et les IDs des FKs.
    /// </summary>
    private static async Task BulkInsertWithIdentityAsync<T>(AppDbContext db, string table, List<T> entities, CancellationToken ct)
        where T : class
    {
        if (entities.Count == 0) return;

        // Noms de tables en dur (jamais d'input utilisateur) — warning EF1002 non applicable.
#pragma warning disable EF1002
        await using var tx = await db.Database.BeginTransactionAsync(ct);
        await db.Database.ExecuteSqlRawAsync($"SET IDENTITY_INSERT dbo.[{table}] ON", ct);
        db.Set<T>().AddRange(entities);
        await db.SaveChangesAsync(ct);
        await db.Database.ExecuteSqlRawAsync($"SET IDENTITY_INSERT dbo.[{table}] OFF", ct);
        await tx.CommitAsync(ct);
#pragma warning restore EF1002
    }

    // ----- DTOs de deserialisation JSON -----
    private sealed class BrandJson
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
    }

    private sealed class CategoryJson
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public int? ParentId { get; set; }
        public List<CategoryJson> Children { get; set; } = [];
    }

    private sealed class ProductJson
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public string? Description { get; set; }
        public string Sku { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OldPrice { get; set; }
        public int Stock { get; set; }
        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }
        public string MainImage { get; set; } = string.Empty;
        public List<string> Images { get; set; } = [];
        public int CategoryId { get; set; }
        public int BrandId { get; set; }
        public List<SpecJson> Specifications { get; set; } = [];
        public double Rating { get; set; }
        public int ReviewCount { get; set; }
        public string? CreatedAt { get; set; }
    }

    private sealed class SpecJson
    {
        public string Group { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }

    private sealed class BannerJson
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string? LinkUrl { get; set; }
        public string? CtaLabel { get; set; }
        public bool IsActive { get; set; }
    }

    private sealed class ReviewJson
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string? CreatedAt { get; set; }
    }
}
