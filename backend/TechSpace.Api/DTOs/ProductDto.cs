using TechSpace.Api.Models;

namespace TechSpace.Api.DTOs;

public class ProductSummaryDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string ShortDescription { get; init; } = string.Empty;
    public string Sku { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public decimal? OldPrice { get; init; }
    public int Stock { get; init; }
    public bool IsActive { get; init; }
    public bool IsFeatured { get; init; }
    public string MainImage { get; init; } = string.Empty;
    public int CategoryId { get; init; }
    public string CategoryName { get; init; } = string.Empty;
    public string CategorySlug { get; init; } = string.Empty;
    public int BrandId { get; init; }
    public string BrandName { get; init; } = string.Empty;
    public double Rating { get; init; }
    public int ReviewCount { get; init; }
    public DateTime CreatedAt { get; init; }
    public ProductType ProductType { get; init; }
}

public class ProductDetailDto : ProductSummaryDto
{
    public string Description { get; init; } = string.Empty;
    public string? MetaTitle { get; init; }
    public string? MetaDescription { get; init; }
    public string? VendorUrl { get; init; }
    public string? SourceUrl { get; init; }

    // Rétrocompatibilité frontend : URLs images ordonnées
    public IReadOnlyList<string> Images { get; init; } = [];

    public IReadOnlyList<ProductMediaDto> Media { get; init; } = [];
    public IReadOnlyList<ProductSpecDto> Specifications { get; init; } = [];
    public IReadOnlyList<ProductVariantDto> Variants { get; init; } = [];
    public IReadOnlyList<ProductDocumentDto> Documents { get; init; } = [];
    public IReadOnlyList<string> Tags { get; init; } = [];
}

public record ProductSpecDto(string Group, string Key, string Value);

public record ProductMediaDto(
    int Id,
    string Url,
    string MediaType,
    string? PosterUrl,
    int? Width,
    int? Height,
    string? Alt,
    int SortOrder
);

public record ProductVariantDto(
    int Id,
    string Title,
    string Sku,
    decimal Price,
    decimal? OldPrice,
    int Stock,
    string? OptionsJson,
    bool IsDefault,
    int SortOrder
);

public record ProductDocumentDto(
    int Id,
    string Title,
    string Url,
    string DocumentType,
    long? FileSizeBytes,
    string? Language
);
