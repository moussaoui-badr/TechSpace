using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
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
            logger.LogInformation("Seed ignoré : la base contient déjà des produits.");
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

        // Fichiers enrichis générés par le scraper (optionnels)
        var specAttributes = await LoadOptionalAsync<List<SpecAttributeJson>>(seedDir, "spec-attributes.json", ct);
        var productAttributes = await LoadOptionalAsync<List<ProductAttributeJson>>(seedDir, "product-attributes.json", ct);
        var variants = await LoadOptionalAsync<List<VariantJson>>(seedDir, "variants.json", ct);
        var documents = await LoadOptionalAsync<List<DocumentJson>>(seedDir, "documents.json", ct);
        var tags = await LoadOptionalAsync<List<TagJson>>(seedDir, "tags.json", ct);
        var productTags = await LoadOptionalAsync<List<ProductTagLinkJson>>(seedDir, "product-tags.json", ct);
        var media = await LoadOptionalAsync<List<MediaJson>>(seedDir, "media.json", ct);

        await InsertBrandsAsync(db, brands, ct);
        await InsertCategoriesAsync(db, categories, ct);
        await InsertProductsAsync(db, products, media, ct);
        await InsertBannersAsync(db, banners, ct);
        await InsertReviewsAsync(db, reviews, ct);

        if (specAttributes is { Count: > 0 })
            await InsertSpecAttributesAsync(db, specAttributes, ct);

        if (productAttributes is { Count: > 0 })
            await InsertProductAttributesAsync(db, productAttributes, ct);

        if (variants is { Count: > 0 })
            await InsertVariantsAsync(db, variants, ct);

        if (documents is { Count: > 0 })
            await InsertDocumentsAsync(db, documents, ct);

        if (tags is { Count: > 0 })
            await InsertTagsAsync(db, tags, productTags ?? [], ct);

        logger.LogInformation(
            "Seed OK : {B} brands, {C} catégories, {P} produits, {Bn} banners, {R} reviews, {Sa} attributs, {V} variantes, {D} documents.",
            brands.Count,
            categories.Sum(c => 1 + c.Children.Count),
            products.Count,
            banners.Count,
            reviews.Count,
            specAttributes?.Count ?? 0,
            variants?.Count ?? 0,
            documents?.Count ?? 0);
    }

    private static async Task<T> LoadAsync<T>(string dir, string file, CancellationToken ct)
    {
        var path = Path.Combine(dir, file);
        await using var stream = File.OpenRead(path);
        var data = await JsonSerializer.DeserializeAsync<T>(stream, JsonOpts, ct);
        return data ?? throw new InvalidOperationException($"JSON seed vide : {file}");
    }

    private static async Task<T?> LoadOptionalAsync<T>(string dir, string file, CancellationToken ct)
    {
        var path = Path.Combine(dir, file);
        if (!File.Exists(path)) return default;
        await using var stream = File.OpenRead(path);
        return await JsonSerializer.DeserializeAsync<T>(stream, JsonOpts, ct);
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

    private static async Task InsertProductsAsync(AppDbContext db, List<ProductJson> products, List<MediaJson>? mediaOverride, CancellationToken ct)
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
            ProductType = p.ProductType,
            MetaTitle = p.MetaTitle,
            MetaDescription = p.MetaDescription,
            Barcode = p.Barcode,
            Weight = p.Weight,
            VendorUrl = p.VendorUrl,
            ExternalId = p.ExternalId,
            SourceUrl = p.SourceUrl,
            CreatedAt = ParseDate(p.CreatedAt) ?? DateTime.UtcNow,
            UpdatedAt = ParseDate(p.UpdatedAt) ?? DateTime.UtcNow,
            PublishedAt = ParseDate(p.PublishedAt),
        }).ToList();

        await BulkInsertWithIdentityAsync(db, "Products", entities, ct);

        // Média : priorité à media.json si fourni, sinon fallback sur le champ images[]
        var mediaEntities = new List<ProductMedia>();

        if (mediaOverride is { Count: > 0 })
        {
            foreach (var m in mediaOverride)
            {
                mediaEntities.Add(new ProductMedia
                {
                    ProductId = m.ProductId,
                    Url = m.Url,
                    MediaType = m.MediaType,
                    PosterUrl = m.PosterUrl,
                    Width = m.Width,
                    Height = m.Height,
                    Duration = m.Duration,
                    Alt = m.Alt,
                    SortOrder = m.SortOrder,
                });
            }
        }
        else
        {
            foreach (var p in products)
            {
                for (var i = 0; i < p.Images.Count; i++)
                {
                    mediaEntities.Add(new ProductMedia
                    {
                        ProductId = p.Id,
                        Url = p.Images[i],
                        MediaType = MediaType.Image,
                        SortOrder = i,
                    });
                }
            }
        }

        db.ProductMedia.AddRange(mediaEntities);

        var specs = new List<ProductSpecification>();
        foreach (var p in products)
        {
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

        db.ProductSpecifications.AddRange(specs);
        await db.SaveChangesAsync(ct);
    }

    private static async Task InsertBannersAsync(AppDbContext db, List<BannerJson> banners, CancellationToken ct)
    {
        var entities = banners.Select((b, i) => new Banner
        {
            Id = b.Id,
            Title = b.Title,
            Subtitle = b.Subtitle,
            ImageUrl = b.ImageUrl,
            VideoUrl = b.VideoUrl,
            PosterUrl = b.PosterUrl,
            MobileImageUrl = b.MobileImageUrl,
            LinkUrl = b.LinkUrl,
            CtaLabel = b.CtaLabel,
            IsActive = b.IsActive,
            SortOrder = i,
        }).ToList();

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
            CreatedAt = ParseDate(r.CreatedAt) ?? DateTime.UtcNow,
        }).ToList();

        await BulkInsertWithIdentityAsync(db, "Reviews", entities, ct);
    }

    private static async Task InsertSpecAttributesAsync(AppDbContext db, List<SpecAttributeJson> list, CancellationToken ct)
    {
        var entities = list.Select(a => new SpecAttribute
        {
            Id = a.Id,
            Name = a.Name,
            Slug = a.Slug,
            Unit = a.Unit,
            DataType = a.DataType,
            IsFilterable = a.IsFilterable,
            IsComparable = a.IsComparable,
            CategoryScope = a.CategoryScope,
        }).ToList();

        await BulkInsertWithIdentityAsync(db, "SpecAttributes", entities, ct);
    }

    private static async Task InsertProductAttributesAsync(AppDbContext db, List<ProductAttributeJson> list, CancellationToken ct)
    {
        var entities = list.Select(a => new ProductAttributeValue
        {
            ProductId = a.ProductId,
            AttributeId = a.AttributeId,
            TextValue = a.TextValue,
            NumericValue = a.NumericValue,
            BooleanValue = a.BooleanValue,
        }).ToList();

        db.ProductAttributeValues.AddRange(entities);
        await db.SaveChangesAsync(ct);
    }

    private static async Task InsertVariantsAsync(AppDbContext db, List<VariantJson> list, CancellationToken ct)
    {
        var entities = list.Select(v => new ProductVariant
        {
            Id = v.Id,
            ProductId = v.ProductId,
            Title = v.Title,
            Sku = v.Sku,
            Price = v.Price,
            OldPrice = v.OldPrice,
            Stock = v.Stock,
            Barcode = v.Barcode,
            OptionsJson = v.OptionsJson,
            IsDefault = v.IsDefault,
            SortOrder = v.SortOrder,
        }).ToList();

        await BulkInsertWithIdentityAsync(db, "ProductVariants", entities, ct);
    }

    private static async Task InsertDocumentsAsync(AppDbContext db, List<DocumentJson> list, CancellationToken ct)
    {
        var entities = list.Select(d => new ProductDocument
        {
            Id = d.Id,
            ProductId = d.ProductId,
            Title = d.Title,
            Url = d.Url,
            DocumentType = d.DocumentType,
            FileSizeBytes = d.FileSizeBytes,
            Language = d.Language,
        }).ToList();

        await BulkInsertWithIdentityAsync(db, "ProductDocuments", entities, ct);
    }

    private static async Task InsertTagsAsync(AppDbContext db, List<TagJson> tags, List<ProductTagLinkJson> links, CancellationToken ct)
    {
        var tagEntities = tags.Select(t => new ProductTag
        {
            Id = t.Id,
            Name = t.Name,
            Slug = t.Slug,
        }).ToList();

        await BulkInsertWithIdentityAsync(db, "ProductTags", tagEntities, ct);

        // Liens many-to-many via la table de jointure implicite
        foreach (var link in links)
        {
            var product = await db.Products.FindAsync([link.ProductId], ct);
            var tag = await db.ProductTags.FindAsync([link.TagId], ct);
            if (product is not null && tag is not null)
                product.Tags.Add(tag);
        }

        await db.SaveChangesAsync(ct);
    }

    /// <summary>
    /// Insère en préservant les IDs (IDENTITY_INSERT ON pour SQL Server).
    /// </summary>
    private static async Task BulkInsertWithIdentityAsync<T>(AppDbContext db, string table, List<T> entities, CancellationToken ct)
        where T : class
    {
        if (entities.Count == 0) return;

#pragma warning disable EF1002
        await using var tx = await db.Database.BeginTransactionAsync(ct);
        await db.Database.ExecuteSqlRawAsync($"SET IDENTITY_INSERT dbo.[{table}] ON", ct);
        db.Set<T>().AddRange(entities);
        await db.SaveChangesAsync(ct);
        await db.Database.ExecuteSqlRawAsync($"SET IDENTITY_INSERT dbo.[{table}] OFF", ct);
        await tx.CommitAsync(ct);
#pragma warning restore EF1002
    }

    private static DateTime? ParseDate(string? value)
    {
        if (string.IsNullOrEmpty(value)) return null;
        return DateTime.TryParse(value, out var dt) ? dt.ToUniversalTime() : null;
    }

    public static async Task SeedIdentityAsync(IServiceProvider services, IConfiguration config, ILogger logger)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();

        foreach (var role in new[] { "Admin", "Customer" })
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
        }

        const string adminEmail = "admin@loot.ma";
        if (await userManager.FindByEmailAsync(adminEmail) is null)
        {
            var password = config["Seed:AdminPassword"] ?? "Admin@loot2026";
            var admin = new AppUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "Admin",
                LastName = "Loot",
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow,
            };
            var result = await userManager.CreateAsync(admin, password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Admin");
                logger.LogInformation("Compte admin créé : {Email}", adminEmail);
            }
            else
            {
                logger.LogWarning("Échec création admin : {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
    }

    // ─── DTOs de désérialisation JSON ───────────────────────────────────────

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
        public ProductType ProductType { get; set; } = ProductType.Physical;
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? Barcode { get; set; }
        public decimal? Weight { get; set; }
        public string? VendorUrl { get; set; }
        public long? ExternalId { get; set; }
        public string? SourceUrl { get; set; }
        public string? CreatedAt { get; set; }
        public string? UpdatedAt { get; set; }
        public string? PublishedAt { get; set; }
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
        public string? VideoUrl { get; set; }
        public string? PosterUrl { get; set; }
        public string? MobileImageUrl { get; set; }
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

    private sealed class MediaJson
    {
        public int ProductId { get; set; }
        public string Url { get; set; } = string.Empty;
        public MediaType MediaType { get; set; } = MediaType.Image;
        public string? PosterUrl { get; set; }
        public int? Width { get; set; }
        public int? Height { get; set; }
        public int? Duration { get; set; }
        public string? Alt { get; set; }
        public int SortOrder { get; set; }
    }

    private sealed class SpecAttributeJson
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Unit { get; set; }
        public AttributeDataType DataType { get; set; } = AttributeDataType.Text;
        public bool IsFilterable { get; set; }
        public bool IsComparable { get; set; }
        public int? CategoryScope { get; set; }
    }

    private sealed class ProductAttributeJson
    {
        public int ProductId { get; set; }
        public int AttributeId { get; set; }
        public string? TextValue { get; set; }
        public decimal? NumericValue { get; set; }
        public bool? BooleanValue { get; set; }
    }

    private sealed class VariantJson
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OldPrice { get; set; }
        public int Stock { get; set; }
        public string? Barcode { get; set; }
        public string? OptionsJson { get; set; }
        public bool IsDefault { get; set; }
        public int SortOrder { get; set; }
    }

    private sealed class DocumentJson
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public DocumentType DocumentType { get; set; } = DocumentType.Other;
        public long? FileSizeBytes { get; set; }
        public string? Language { get; set; }
    }

    private sealed class TagJson
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
    }

    private sealed class ProductTagLinkJson
    {
        public int ProductId { get; set; }
        public int TagId { get; set; }
    }
}
