using System.Text.Json.Serialization;

namespace TechSpace.Scraper.Shopify.Models;

public class ShopifyCollectionsResponse
{
    [JsonPropertyName("collections")]
    public List<ShopifyCollection> Collections { get; set; } = [];
}

public class ShopifyCollection
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("handle")]
    public string Handle { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("body_html")]
    public string? BodyHtml { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("published_at")]
    public DateTime? PublishedAt { get; set; }

    [JsonPropertyName("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    [JsonPropertyName("image")]
    public ShopifyCollectionImage? Image { get; set; }
}

public class ShopifyCollectionImage
{
    [JsonPropertyName("src")]
    public string Src { get; set; } = string.Empty;

    [JsonPropertyName("alt")]
    public string? Alt { get; set; }
}
