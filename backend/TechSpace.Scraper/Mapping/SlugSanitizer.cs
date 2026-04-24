using System.Text;
using System.Text.RegularExpressions;

namespace TechSpace.Scraper.Mapping;

public static partial class SlugSanitizer
{
    [GeneratedRegex(@"[^a-z0-9\-]")]
    private static partial Regex InvalidCharsRegex();

    [GeneratedRegex(@"-{2,}")]
    private static partial Regex MultiDashRegex();

    public static string Sanitize(string input, int maxLen = 220)
    {
        if (string.IsNullOrWhiteSpace(input)) return "produit";

        var normalized = input.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(normalized.Length);
        foreach (var c in normalized)
        {
            var cat = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (cat != System.Globalization.UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        }

        var ascii = sb.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant();
        var slug = InvalidCharsRegex().Replace(ascii.Replace(' ', '-'), string.Empty);
        slug = MultiDashRegex().Replace(slug, "-").Trim('-');

        if (slug.Length > maxLen) slug = slug[..maxLen].TrimEnd('-');
        return string.IsNullOrEmpty(slug) ? "produit" : slug;
    }

    public static string Deduplicate(string slug, HashSet<string> used)
    {
        if (used.Add(slug)) return slug;

        for (var i = 2; i < 1000; i++)
        {
            var candidate = $"{slug}-{i}";
            if (used.Add(candidate)) return candidate;
        }

        throw new InvalidOperationException($"Impossible de déduplicater le slug : {slug}");
    }
}
