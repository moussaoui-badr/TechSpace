namespace TechSpace.Api.DTOs;

public record ReviewDto(int Id, int ProductId, string UserName, int Rating, string Comment, DateTime CreatedAt);
