namespace TechSpace.Api.Models;

public enum MediaType { Image, Video, ExternalVideo, Model3D }

public class ProductMedia
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public string Url { get; set; } = string.Empty;
    public MediaType MediaType { get; set; } = MediaType.Image;
    public string? PosterUrl { get; set; }
    public int? Width { get; set; }
    public int? Height { get; set; }
    public int? Duration { get; set; }
    public string? Alt { get; set; }
    public int SortOrder { get; set; }
}
