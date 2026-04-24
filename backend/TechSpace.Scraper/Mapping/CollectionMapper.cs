using TechSpace.Scraper.Output;
using TechSpace.Scraper.Shopify.Models;

namespace TechSpace.Scraper.Mapping;

public class CollectionMapper
{
    private int _nextId = 1;
    private readonly HashSet<string> _usedSlugs = [];

    public List<CategoryJson> Map(List<ShopifyCollection> collections)
    {
        var all = new Dictionary<string, CategoryJson>(StringComparer.OrdinalIgnoreCase);

        foreach (var col in collections)
        {
            var slug = SlugSanitizer.Deduplicate(
                string.IsNullOrEmpty(col.Handle) ? SlugSanitizer.Sanitize(col.Title) : col.Handle,
                _usedSlugs);

            all[col.Handle] = new CategoryJson
            {
                Id = _nextId++,
                Name = col.Title.Trim()[..Math.Min(col.Title.Trim().Length, 100)],
                Slug = slug,
                Description = string.IsNullOrEmpty(col.BodyHtml)
                    ? null
                    : HtmlToPlainText(col.BodyHtml)[..Math.Min(HtmlToPlainText(col.BodyHtml).Length, 500)],
                ImageUrl = col.Image?.Src,
                Children = [],
                ParentId = null,
            };
        }

        // Heuristique hiérarchie : "pc-gamer-processeurs" → parent "pc-gamer"
        // On cherche le préfixe commun le plus long qui existe comme collection
        var roots = new List<CategoryJson>();
        var assigned = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var (handle, cat) in all)
        {
            string? parentHandle = FindParentHandle(handle, all.Keys);
            if (parentHandle is not null && all.TryGetValue(parentHandle, out var parent))
            {
                cat.ParentId = parent.Id;
                parent.Children.Add(cat);
                assigned.Add(handle);
            }
        }

        foreach (var (handle, cat) in all)
        {
            if (!assigned.Contains(handle))
                roots.Add(cat);
        }

        return roots;
    }

    private static string? FindParentHandle(string handle, IEnumerable<string> candidates)
    {
        var parts = handle.Split('-');
        // Essaie de trouver un handle qui est un préfixe strict (moins de segments)
        string? best = null;
        int bestLen = 0;

        foreach (var candidate in candidates)
        {
            if (string.Equals(candidate, handle, StringComparison.OrdinalIgnoreCase)) continue;
            var candidateParts = candidate.Split('-');
            if (candidateParts.Length >= parts.Length) continue;
            if (handle.StartsWith(candidate + "-", StringComparison.OrdinalIgnoreCase) &&
                candidateParts.Length > bestLen)
            {
                best = candidate;
                bestLen = candidateParts.Length;
            }
        }

        return best;
    }

    private static string HtmlToPlainText(string html)
    {
        // Retrait simple des tags HTML pour la description
        return System.Text.RegularExpressions.Regex.Replace(html, "<[^>]+>", " ")
            .Replace("&nbsp;", " ")
            .Replace("&amp;", "&")
            .Replace("&lt;", "<")
            .Replace("&gt;", ">")
            .Replace("&quot;", "\"")
            .Trim();
    }
}
