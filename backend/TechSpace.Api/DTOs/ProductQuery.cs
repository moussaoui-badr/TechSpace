namespace TechSpace.Api.DTOs;

public class ProductQuery
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 24;
    public string? Search { get; set; }
    public string? CategorySlug { get; set; }
    public List<string>? BrandSlugs { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? InStock { get; set; }
    /// <summary>default | price-asc | price-desc | newest | rating | popular | promo</summary>
    public string? SortBy { get; set; }
    public bool? Featured { get; set; }
}
