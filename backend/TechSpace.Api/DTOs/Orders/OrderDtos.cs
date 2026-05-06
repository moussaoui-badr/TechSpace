using System.ComponentModel.DataAnnotations;
using TechSpace.Api.Models;

namespace TechSpace.Api.DTOs.Orders;

// ── Requête checkout ──

public class CheckoutRequest
{
    [Required, MaxLength(200)]
    public string FirstName { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string LastName { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required, MaxLength(300)]
    public string Address { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string City { get; set; } = string.Empty;

    [MaxLength(10)]
    public string PostalCode { get; set; } = string.Empty;

    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Cod;

    [Required, MinLength(1)]
    public List<CheckoutItemRequest> Items { get; set; } = [];
}

public class CheckoutItemRequest
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}

// ── Réponses ──

public record OrderItemDto(
    int ProductId,
    string ProductName,
    string ProductImage,
    string ProductSku,
    decimal UnitPrice,
    int Quantity,
    decimal Total
);

public record OrderDto(
    int Id,
    string OrderNumber,
    string Status,
    string PaymentMethod,
    string ShipFullName,
    string ShipPhone,
    string ShipAddress,
    string ShipCity,
    string ShipPostalCode,
    string ShipCountry,
    decimal Subtotal,
    decimal Shipping,
    decimal Total,
    DateTime CreatedAt,
    IReadOnlyList<OrderItemDto> Items
);
