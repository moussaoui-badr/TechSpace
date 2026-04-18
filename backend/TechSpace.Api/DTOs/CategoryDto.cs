namespace TechSpace.Api.DTOs;

public class CategoryDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? ImageUrl { get; init; }
    public int? ParentId { get; init; }
    public List<CategoryDto> Children { get; init; } = [];
}
