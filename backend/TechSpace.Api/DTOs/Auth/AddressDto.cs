using System.ComponentModel.DataAnnotations;

namespace TechSpace.Api.DTOs.Auth;

public record AddressDto(
    string Id,
    string Label,
    string FullName,
    string Phone,
    string Line1,
    string? Line2,
    string City,
    string PostalCode,
    string Country,
    bool IsDefault
);

public class UpsertAddressRequest
{
    [Required, MaxLength(32)]
    public string Label { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string FullName { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required, MaxLength(300)]
    public string Line1 { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Line2 { get; set; }

    [Required, MaxLength(100)]
    public string City { get; set; } = string.Empty;

    [Required, MaxLength(10)]
    public string PostalCode { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Country { get; set; } = "Maroc";

    public bool IsDefault { get; set; }
}
