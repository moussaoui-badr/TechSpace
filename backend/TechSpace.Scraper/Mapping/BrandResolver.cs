using TechSpace.Scraper.Output;

namespace TechSpace.Scraper.Mapping;

public class BrandResolver
{
    private readonly Dictionary<string, BrandJson> _byVendor = new(StringComparer.OrdinalIgnoreCase);
    private int _nextId = 1;
    private readonly HashSet<string> _usedSlugs = [];

    public BrandJson Resolve(string vendor)
    {
        if (string.IsNullOrWhiteSpace(vendor)) vendor = "Autre";

        if (_byVendor.TryGetValue(vendor, out var existing)) return existing;

        var slug = SlugSanitizer.Deduplicate(SlugSanitizer.Sanitize(vendor, 120), _usedSlugs);
        var brand = new BrandJson
        {
            Id = _nextId++,
            Name = vendor.Trim()[..Math.Min(vendor.Trim().Length, 100)],
            Slug = slug,
        };
        _byVendor[vendor] = brand;
        return brand;
    }

    public List<BrandJson> GetAll() => [.. _byVendor.Values.OrderBy(b => b.Id)];
}
