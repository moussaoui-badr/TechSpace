using System.Text.RegularExpressions;
using TechSpace.Scraper.Output;

namespace TechSpace.Scraper.Parsing;

public partial class SpecExtractor
{
    [GeneratedRegex(@"[\d]+([.,]\d+)?")]
    private static partial Regex NumericRegex();

    private readonly Dictionary<string, SpecAttributeJson> _attributes = new(StringComparer.OrdinalIgnoreCase);
    private readonly Dictionary<string, int> _occurrences = new(StringComparer.OrdinalIgnoreCase);
    private int _nextId = 1;

    public void Observe(string key, string value)
    {
        if (string.IsNullOrWhiteSpace(key)) return;

        var slug = Slugify(key);
        _occurrences[slug] = (_occurrences.GetValueOrDefault(slug, 0)) + 1;

        if (!_attributes.ContainsKey(slug))
        {
            var (dataType, unit) = InferType(value);
            _attributes[slug] = new SpecAttributeJson
            {
                Id = _nextId++,
                Name = key.Trim()[..Math.Min(key.Trim().Length, 100)],
                Slug = slug[..Math.Min(slug.Length, 100)],
                Unit = unit,
                DataType = dataType,
                IsFilterable = false,
                IsComparable = false,
            };
        }
    }

    public List<SpecAttributeJson> GetAttributes()
    {
        // Marquer comme filtrable/comparable les attributs qui apparaissent sur ≥ 3 produits
        // et dont le type est numérique ou enum
        foreach (var (slug, attr) in _attributes)
        {
            var count = _occurrences.GetValueOrDefault(slug, 0);
            if (count >= 3)
            {
                attr.IsFilterable = true;
                attr.IsComparable = attr.DataType is "Number" or "Boolean";
            }
        }

        return [.. _attributes.Values.OrderBy(a => a.Id)];
    }

    public ProductAttributeValueJson? ToAttributeValue(int productId, string key, string value)
    {
        var slug = Slugify(key);
        if (!_attributes.TryGetValue(slug, out var attr)) return null;

        string? textValue = null;
        decimal? numericValue = null;
        bool? boolValue = null;

        switch (attr.DataType)
        {
            case "Number":
                var match = NumericRegex().Match(value);
                if (match.Success && decimal.TryParse(
                    match.Value.Replace(',', '.'),
                    System.Globalization.NumberStyles.Any,
                    System.Globalization.CultureInfo.InvariantCulture,
                    out var num))
                    numericValue = num;
                else
                    textValue = value[..Math.Min(value.Length, 500)];
                break;

            case "Boolean":
                boolValue = value.ToLowerInvariant() is "oui" or "yes" or "true" or "1";
                break;

            default:
                textValue = value[..Math.Min(value.Length, 500)];
                break;
        }

        return new ProductAttributeValueJson
        {
            ProductId = productId,
            AttributeId = attr.Id,
            TextValue = textValue,
            NumericValue = numericValue,
            BooleanValue = boolValue,
        };
    }

    private static (string dataType, string? unit) InferType(string value)
    {
        var trimmed = value.Trim().ToLowerInvariant();

        if (trimmed is "oui" or "non" or "yes" or "no" or "true" or "false")
            return ("Boolean", null);

        var units = new[] { "ghz", "mhz", "go", "gb", "to", "tb", "mo", "mb", "w", "v", "hz", "db", "ms", "mm", "cm", "kg", "g" };
        foreach (var unit in units)
        {
            if (trimmed.EndsWith(unit) || trimmed.EndsWith(' ' + unit))
            {
                if (NumericRegex().IsMatch(trimmed))
                    return ("Number", unit.ToUpperInvariant());
            }
        }

        if (NumericRegex().IsMatch(trimmed) && trimmed.Length < 20)
            return ("Number", null);

        return ("Text", null);
    }

    private static string Slugify(string key)
    {
        var slug = key.ToLowerInvariant()
            .Replace(' ', '_')
            .Replace('-', '_');
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9_]", string.Empty);
        return slug.Length > 100 ? slug[..100] : slug;
    }
}
