namespace TechSpace.Api.DTOs.Auth;

public record AuthUserDto(
    string Id,
    string Email,
    string FirstName,
    string LastName,
    string? Phone,
    IList<string> Roles
);
