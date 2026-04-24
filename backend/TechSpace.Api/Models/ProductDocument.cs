namespace TechSpace.Api.Models;

public enum DocumentType { Datasheet, Manual, Driver, Warranty, Certificate, Other }

public class ProductDocument
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public DocumentType DocumentType { get; set; } = DocumentType.Other;
    public long? FileSizeBytes { get; set; }
    public string? Language { get; set; }
}
