namespace TechSpace.Api.Models;

public class ProductVariant
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public Product? Product { get; set; }

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
