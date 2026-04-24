namespace TechSpace.Api.Models;

public enum AttributeDataType { Text, Number, Boolean, Enum }

public class SpecAttribute
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Unit { get; set; }
    public AttributeDataType DataType { get; set; } = AttributeDataType.Text;
    public bool IsFilterable { get; set; }
    public bool IsComparable { get; set; }
    public int? CategoryScope { get; set; }
    public Category? CategoryScopeNav { get; set; }

    public ICollection<ProductAttributeValue> ProductValues { get; set; } = new List<ProductAttributeValue>();
}
