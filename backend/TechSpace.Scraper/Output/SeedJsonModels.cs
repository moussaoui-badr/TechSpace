using System.Text.Json.Serialization;

namespace TechSpace.Scraper.Output;

public class BrandJson
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
}

public class CategoryJson
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int? ParentId { get; set; }
    public List<CategoryJson> Children { get; set; } = [];
}

public class ProductJson
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
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; }
    public string MainImage { get; set; } = string.Empty;
    public List<string> Images { get; set; } = [];
    public int CategoryId { get; set; }
    public int BrandId { get; set; }
    public List<SpecJson> Specifications { get; set; } = [];
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public string ProductType { get; set; } = "Physical";
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

public class SpecJson
{
    public string Group { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}

public class MediaJson
{
    public int ProductId { get; set; }
    public string Url { get; set; } = string.Empty;
    public string MediaType { get; set; } = "Image";
    public string? PosterUrl { get; set; }
    public int? Width { get; set; }
    public int? Height { get; set; }
    public int? Duration { get; set; }
    public string? Alt { get; set; }
    public int SortOrder { get; set; }
}

public class VariantJson
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

public class DocumentJson
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string DocumentType { get; set; } = "Other";
    public long? FileSizeBytes { get; set; }
    public string? Language { get; set; }
}

public class SpecAttributeJson
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Unit { get; set; }
    public string DataType { get; set; } = "Text";
    public bool IsFilterable { get; set; }
    public bool IsComparable { get; set; }
    public int? CategoryScope { get; set; }
}

public class ProductAttributeValueJson
{
    public int ProductId { get; set; }
    public int AttributeId { get; set; }
    public string? TextValue { get; set; }
    public decimal? NumericValue { get; set; }
    public bool? BooleanValue { get; set; }
}

public class TagJson
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}

public class ProductTagLinkJson
{
    public int ProductId { get; set; }
    public int TagId { get; set; }
}

public class BannerJson
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
    public bool IsActive { get; set; } = true;
}

public class ReviewJson
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public string? CreatedAt { get; set; }
}
