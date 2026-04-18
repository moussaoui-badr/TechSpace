namespace TechSpace.Api.DTOs;

public record BannerDto(int Id, string Title, string? Subtitle, string ImageUrl, string? LinkUrl, string? CtaLabel);
