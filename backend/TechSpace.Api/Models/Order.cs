namespace TechSpace.Api.Models;

public enum OrderStatus
{
    Pending,
    Confirmed,
    Preparing,
    Shipping,
    Delivered,
    Cancelled,
}

public enum PaymentMethod
{
    Cod,
    Transfer,
}

public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;

    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Cod;

    // Snapshot adresse au moment de la commande
    public string ShipFullName { get; set; } = string.Empty;
    public string ShipPhone { get; set; } = string.Empty;
    public string ShipAddress { get; set; } = string.Empty;
    public string ShipCity { get; set; } = string.Empty;
    public string ShipPostalCode { get; set; } = string.Empty;
    public string ShipCountry { get; set; } = "Maroc";

    public decimal Subtotal { get; set; }
    public decimal Shipping { get; set; }
    public decimal Total { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<OrderItem> Items { get; set; } = [];
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    // Snapshot produit au moment de la commande
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductImage { get; set; } = string.Empty;
    public string ProductSku { get; set; } = string.Empty;

    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal Total { get; set; }
}
