namespace TechSpace.Api.Models;

public class ProductAttributeValue
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public Product? Product { get; set; }
    public int AttributeId { get; set; }
    public SpecAttribute? Attribute { get; set; }

    public string? TextValue { get; set; }
    public decimal? NumericValue { get; set; }
    public bool? BooleanValue { get; set; }
}
