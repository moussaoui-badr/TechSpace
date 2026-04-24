namespace TechSpace.Api.Models;

public class Banner
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
    public int SortOrder { get; set; }
}
