using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechSpace.Api.Data;
using TechSpace.Api.DTOs.Orders;
using TechSpace.Api.Models;

namespace TechSpace.Api.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController(AppDbContext db, UserManager<AppUser> userManager) : ControllerBase
{
    private const decimal ShippingThreshold = 500m;
    private const decimal ShippingCost = 40m;

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CheckoutRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var productIds = req.Items.Select(i => i.ProductId).Distinct().ToList();
        var products = await db.Products
            .Where(p => productIds.Contains(p.Id) && p.IsActive)
            .ToListAsync();

        if (products.Count != productIds.Count)
            return BadRequest(new { message = "Un ou plusieurs produits sont introuvables ou inactifs." });

        var productMap = products.ToDictionary(p => p.Id);

        foreach (var item in req.Items)
        {
            if (item.Quantity <= 0)
                return BadRequest(new { message = $"Quantité invalide pour le produit {item.ProductId}." });
            if (productMap[item.ProductId].Stock < item.Quantity)
                return BadRequest(new { message = $"Stock insuffisant pour '{productMap[item.ProductId].Name}'." });
        }

        var subtotal = req.Items.Sum(i => productMap[i.ProductId].Price * i.Quantity);
        var shipping = subtotal >= ShippingThreshold ? 0m : ShippingCost;
        var total = subtotal + shipping;

        var order = new Order
        {
            OrderNumber = GenerateOrderNumber(),
            UserId = user.Id,
            PaymentMethod = req.PaymentMethod,
            ShipFullName = $"{req.FirstName} {req.LastName}".Trim(),
            ShipPhone = req.Phone,
            ShipAddress = req.Address,
            ShipCity = req.City,
            ShipPostalCode = req.PostalCode,
            ShipCountry = "Maroc",
            Subtotal = subtotal,
            Shipping = shipping,
            Total = total,
            Items = req.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                ProductName = productMap[i.ProductId].Name,
                ProductImage = productMap[i.ProductId].MainImage,
                ProductSku = productMap[i.ProductId].Sku,
                UnitPrice = productMap[i.ProductId].Price,
                Quantity = i.Quantity,
                Total = productMap[i.ProductId].Price * i.Quantity,
            }).ToList(),
        };

        foreach (var item in req.Items)
            productMap[item.ProductId].Stock -= item.Quantity;

        db.Orders.Add(order);
        await db.SaveChangesAsync();

        return Ok(MapToDto(order));
    }

    [HttpGet("mine")]
    public async Task<IActionResult> GetMine()
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var orders = await db.Orders
            .Where(o => o.UserId == user.Id)
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders.Select(MapToDto));
    }

    [HttpGet("{orderNumber}")]
    public async Task<IActionResult> GetByNumber(string orderNumber)
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();

        var order = await db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber && o.UserId == user.Id);

        if (order is null) return NotFound();

        return Ok(MapToDto(order));
    }

    private static string GenerateOrderNumber()
    {
        var datePart = DateTime.UtcNow.ToString("yyMMdd");
        var randomPart = Random.Shared.Next(100000, 999999);
        return $"TS-{datePart}{randomPart}";
    }

    private static OrderDto MapToDto(Order o) => new(
        o.Id,
        o.OrderNumber,
        o.Status.ToString(),
        o.PaymentMethod.ToString(),
        o.ShipFullName,
        o.ShipPhone,
        o.ShipAddress,
        o.ShipCity,
        o.ShipPostalCode,
        o.ShipCountry,
        o.Subtotal,
        o.Shipping,
        o.Total,
        o.CreatedAt,
        o.Items.Select(i => new OrderItemDto(
            i.ProductId, i.ProductName, i.ProductImage, i.ProductSku,
            i.UnitPrice, i.Quantity, i.Total
        )).ToList()
    );
}
