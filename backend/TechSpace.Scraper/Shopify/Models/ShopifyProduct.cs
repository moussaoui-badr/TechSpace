using System.Text.Json.Serialization;

namespace TechSpace.Scraper.Shopify.Models;

public class ShopifyProductsResponse
{
    [JsonPropertyName("products")]
    public List<ShopifyProduct> Products { get; set; } = [];
}

public class ShopifyProduct
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("handle")]
    public string Handle { get; set; } = string.Empty;

    [JsonPropertyName("body_html")]
    public string? BodyHtml { get; set; }

    [JsonPropertyName("vendor")]
    public string Vendor { get; set; } = string.Empty;

    [JsonPropertyName("product_type")]
    public string ProductType { get; set; } = string.Empty;

    // Shopify expose tags comme un tableau de strings dans products.json
    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; } = [];

    [JsonPropertyName("created_at")]
    public DateTime? CreatedAt { get; set; }

    [JsonPropertyName("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    [JsonPropertyName("published_at")]
    public DateTime? PublishedAt { get; set; }

    [JsonPropertyName("variants")]
    public List<ShopifyVariant> Variants { get; set; } = [];

    [JsonPropertyName("images")]
    public List<ShopifyImage> Images { get; set; } = [];

    [JsonPropertyName("options")]
    public List<ShopifyOption> Options { get; set; } = [];
}

public class ShopifyVariant
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("product_id")]
    public long ProductId { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    // Prix en MAD (string décimal) dans products.json
    [JsonPropertyName("price")]
    public string Price { get; set; } = "0";

    [JsonPropertyName("compare_at_price")]
    public string? CompareAtPrice { get; set; }

    [JsonPropertyName("sku")]
    public string? Sku { get; set; }

    // available = true/false (l'API publique ne donne pas la quantité exacte)
    [JsonPropertyName("available")]
    public bool Available { get; set; } = true;

    [JsonPropertyName("grams")]
    public int Grams { get; set; }

    [JsonPropertyName("barcode")]
    public string? Barcode { get; set; }

    [JsonPropertyName("option1")]
    public string? Option1 { get; set; }

    [JsonPropertyName("option2")]
    public string? Option2 { get; set; }

    [JsonPropertyName("option3")]
    public string? Option3 { get; set; }

    [JsonPropertyName("position")]
    public int Position { get; set; }
}

public class ShopifyImage
{
    [JsonPropertyName("src")]
    public string Src { get; set; } = string.Empty;

    [JsonPropertyName("width")]
    public int Width { get; set; }

    [JsonPropertyName("height")]
    public int Height { get; set; }

    [JsonPropertyName("position")]
    public int Position { get; set; }

    [JsonPropertyName("alt")]
    public string? Alt { get; set; }

    [JsonPropertyName("variant_ids")]
    public List<long> VariantIds { get; set; } = [];
}

public class ShopifyOption
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("values")]
    public List<string> Values { get; set; } = [];
}
