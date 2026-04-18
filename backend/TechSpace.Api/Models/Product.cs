namespace TechSpace.Api.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;

    public decimal Price { get; set; }
    public decimal? OldPrice { get; set; }
    public int Stock { get; set; }

    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; }

    public string MainImage { get; set; } = string.Empty;

    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    public int BrandId { get; set; }
    public Brand? Brand { get; set; }

    public double Rating { get; set; }
    public int ReviewCount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<ProductSpecification> Specifications { get; set; } = new List<ProductSpecification>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
