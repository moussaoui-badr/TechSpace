using System.Text.Json.Serialization;

namespace TechSpace.Scraper.Shopify.Models;

public class ShopifyProductJs
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("handle")]
    public string Handle { get; set; } = string.Empty;

    [JsonPropertyName("media")]
    public List<ShopifyMedia> Media { get; set; } = [];
}

public class ShopifyMedia
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("media_type")]
    public string MediaType { get; set; } = "image";

    [JsonPropertyName("src")]
    public string? Src { get; set; }

    [JsonPropertyName("alt")]
    public string? Alt { get; set; }

    [JsonPropertyName("width")]
    public int? Width { get; set; }

    [JsonPropertyName("height")]
    public int? Height { get; set; }

    [JsonPropertyName("position")]
    public int Position { get; set; }

    // Pour les vidéos
    [JsonPropertyName("sources")]
    public List<ShopifyVideoSource>? Sources { get; set; }

    [JsonPropertyName("preview_image")]
    public ShopifyPreviewImage? PreviewImage { get; set; }

    // Pour les vidéos externes (YouTube/Vimeo)
    [JsonPropertyName("external_id")]
    public string? ExternalId { get; set; }

    [JsonPropertyName("host")]
    public string? Host { get; set; }
}

public class ShopifyVideoSource
{
    [JsonPropertyName("url")]
    public string Url { get; set; } = string.Empty;

    [JsonPropertyName("mime_type")]
    public string MimeType { get; set; } = string.Empty;

    [JsonPropertyName("format")]
    public string Format { get; set; } = string.Empty;
}

public class ShopifyPreviewImage
{
    [JsonPropertyName("src")]
    public string Src { get; set; } = string.Empty;

    [JsonPropertyName("width")]
    public int Width { get; set; }

    [JsonPropertyName("height")]
    public int Height { get; set; }
}
