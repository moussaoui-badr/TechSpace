using Microsoft.EntityFrameworkCore;
using TechSpace.Api.Data;
using TechSpace.Api.DTOs;
using TechSpace.Api.Models;

namespace TechSpace.Api.Services;

public class ProductService(AppDbContext db)
{
    private const int MaxPageSize = 100;

    public async Task<PagedResult<ProductSummaryDto>> SearchAsync(ProductQuery query, CancellationToken ct = default)
    {
        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, MaxPageSize);

        IQueryable<Product> q = db.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.Trim();
            q = q.Where(p =>
                EF.Functions.Like(p.Name, $"%{s}%") ||
                EF.Functions.Like(p.ShortDescription, $"%{s}%") ||
                EF.Functions.Like(p.Sku, $"%{s}%"));
        }

        if (!string.IsNullOrWhiteSpace(query.CategorySlug))
        {
            var slug = query.CategorySlug.Trim();
            q = q.Where(p => p.Category!.Slug == slug || p.Category!.Parent!.Slug == slug);
        }

        if (query.BrandSlugs is { Count: > 0 })
        {
            var slugs = query.BrandSlugs
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .Select(s => s.Trim())
                .ToList();
            if (slugs.Count > 0)
                q = q.Where(p => p.Brand != null && slugs.Contains(p.Brand.Slug));
        }

        if (query.MinPrice.HasValue)
            q = q.Where(p => p.Price >= query.MinPrice.Value);

        if (query.MaxPrice.HasValue)
            q = q.Where(p => p.Price <= query.MaxPrice.Value);

        if (query.InStock == true)
            q = q.Where(p => p.Stock > 0);

        if (query.Featured == true)
            q = q.Where(p => p.IsFeatured);

        if (query.SortBy == "promo")
            q = q.Where(p => p.OldPrice != null && p.OldPrice > p.Price);

        q = query.SortBy switch
        {
            "price-asc" => q.OrderBy(p => p.Price),
            "price-desc" => q.OrderByDescending(p => p.Price),
            "newest" => q.OrderByDescending(p => p.CreatedAt),
            "rating" => q.OrderByDescending(p => p.Rating).ThenByDescending(p => p.ReviewCount),
            "popular" => q.OrderByDescending(p => p.ReviewCount).ThenByDescending(p => p.Rating),
            "promo" => q.OrderByDescending(p => (p.OldPrice!.Value - p.Price) / p.OldPrice!.Value),
            _ => q.OrderByDescending(p => p.IsFeatured).ThenByDescending(p => p.Rating),
        };

        var totalCount = await q.CountAsync(ct);

        var items = await q
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => ToSummary(p))
            .ToListAsync(ct);

        return new PagedResult<ProductSummaryDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
        };
    }

    public async Task<ProductDetailDto?> GetBySlugAsync(string slug, CancellationToken ct = default)
    {
        var product = await db.Products
            .AsNoTracking()
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Media.OrderBy(m => m.SortOrder))
            .Include(p => p.Specifications.OrderBy(s => s.SortOrder))
            .Include(p => p.Variants.OrderBy(v => v.SortOrder))
            .Include(p => p.Documents)
            .Include(p => p.Tags)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive, ct);

        if (product is null) return null;

        return new ProductDetailDto
        {
            Id = product.Id,
            Name = product.Name,
            Slug = product.Slug,
            ShortDescription = product.ShortDescription,
            Description = product.Description,
            Sku = product.Sku,
            Price = product.Price,
            OldPrice = product.OldPrice,
            Stock = product.Stock,
            IsActive = product.IsActive,
            IsFeatured = product.IsFeatured,
            MainImage = product.MainImage,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name ?? string.Empty,
            CategorySlug = product.Category?.Slug ?? string.Empty,
            BrandId = product.BrandId,
            BrandName = product.Brand?.Name ?? string.Empty,
            Rating = product.Rating,
            ReviewCount = product.ReviewCount,
            CreatedAt = product.CreatedAt,
            ProductType = product.ProductType,
            MetaTitle = product.MetaTitle,
            MetaDescription = product.MetaDescription,
            VendorUrl = product.VendorUrl,
            SourceUrl = product.SourceUrl,
            Images = product.Media
                .Where(m => m.MediaType == MediaType.Image)
                .OrderBy(m => m.SortOrder)
                .Select(m => m.Url)
                .ToList(),
            Media = product.Media.Select(m => new ProductMediaDto(
                m.Id, m.Url, m.MediaType.ToString(), m.PosterUrl, m.Width, m.Height, m.Alt, m.SortOrder
            )).ToList(),
            Specifications = product.Specifications
                .Select(s => new ProductSpecDto(s.Group, s.Key, s.Value))
                .ToList(),
            Variants = product.Variants.Select(v => new ProductVariantDto(
                v.Id, v.Title, v.Sku, v.Price, v.OldPrice, v.Stock, v.OptionsJson, v.IsDefault, v.SortOrder
            )).ToList(),
            Documents = product.Documents.Select(d => new ProductDocumentDto(
                d.Id, d.Title, d.Url, d.DocumentType.ToString(), d.FileSizeBytes, d.Language
            )).ToList(),
            Tags = product.Tags.Select(t => t.Name).ToList(),
        };
    }

    public async Task<IReadOnlyList<ReviewDto>> GetReviewsAsync(int productId, CancellationToken ct = default)
    {
        return await db.Reviews
            .AsNoTracking()
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto(r.Id, r.ProductId, r.UserName, r.Rating, r.Comment, r.CreatedAt))
            .ToListAsync(ct);
    }

    private static ProductSummaryDto ToSummary(Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Slug = p.Slug,
        ShortDescription = p.ShortDescription,
        Sku = p.Sku,
        Price = p.Price,
        OldPrice = p.OldPrice,
        Stock = p.Stock,
        IsActive = p.IsActive,
        IsFeatured = p.IsFeatured,
        MainImage = p.MainImage,
        CategoryId = p.CategoryId,
        CategoryName = p.Category != null ? p.Category.Name : string.Empty,
        CategorySlug = p.Category != null ? p.Category.Slug : string.Empty,
        BrandId = p.BrandId,
        BrandName = p.Brand != null ? p.Brand.Name : string.Empty,
        Rating = p.Rating,
        ReviewCount = p.ReviewCount,
        CreatedAt = p.CreatedAt,
        ProductType = p.ProductType,
    };
}
