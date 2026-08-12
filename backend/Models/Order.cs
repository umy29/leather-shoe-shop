namespace Backend.Models;

public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    
    public decimal Subtotal { get; set; }
    public decimal SalesTax { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal Total { get; set; }
    
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public List<OrderItem> OrderItems { get; set; } = new();
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int? ShoeId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    
    // Navigation properties
    [System.Text.Json.Serialization.JsonIgnore]
    public Order? Order { get; set; }
    public Shoe? Shoe { get; set; }
}
