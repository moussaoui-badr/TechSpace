using AngleSharp;
using AngleSharp.Dom;
using TechSpace.Scraper.Output;

namespace TechSpace.Scraper.Parsing;

public class BodyHtmlParser
{
    private static readonly AngleSharp.IConfiguration Config = AngleSharp.Configuration.Default;

    public async Task<ParsedBody> ParseAsync(string html, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(html))
            return new ParsedBody([], [], null);

        using var context = BrowsingContext.New(Config);
        using var doc = await context.OpenAsync(req => req.Content(html), ct);

        var specs = ExtractSpecs(doc);
        var documents = ExtractDocuments(doc);
        var vendorUrl = ExtractVendorUrl(doc);

        return new ParsedBody(specs, documents, vendorUrl);
    }

    private static List<SpecRow> ExtractSpecs(IDocument doc)
    {
        var rows = new List<SpecRow>();

        // Tableaux : <table> avec th/td
        foreach (var table in doc.QuerySelectorAll("table"))
        {
            var group = table.QuerySelector("caption")?.TextContent.Trim() ?? "Spécifications";

            foreach (var row in table.QuerySelectorAll("tr"))
            {
                var cells = row.QuerySelectorAll("th, td").ToList();
                if (cells.Count >= 2)
                {
                    var key = cells[0].TextContent.Trim().TrimEnd(':');
                    var value = cells[1].TextContent.Trim();
                    if (!string.IsNullOrWhiteSpace(key) && !string.IsNullOrWhiteSpace(value))
                        rows.Add(new SpecRow(group[..Math.Min(group.Length, 100)],
                            key[..Math.Min(key.Length, 200)],
                            value[..Math.Min(value.Length, 500)]));
                }
            }
        }

        // Listes de définition : <dl><dt>/<dd>
        foreach (var dl in doc.QuerySelectorAll("dl"))
        {
            var group = "Spécifications";
            var dts = dl.QuerySelectorAll("dt").ToList();
            var dds = dl.QuerySelectorAll("dd").ToList();
            for (var i = 0; i < Math.Min(dts.Count, dds.Count); i++)
            {
                var key = dts[i].TextContent.Trim().TrimEnd(':');
                var value = dds[i].TextContent.Trim();
                if (!string.IsNullOrWhiteSpace(key) && !string.IsNullOrWhiteSpace(value))
                    rows.Add(new SpecRow(group, key[..Math.Min(key.Length, 200)], value[..Math.Min(value.Length, 500)]));
            }
        }

        // Pattern "Clé : Valeur" dans des paragraphes ou spans si peu de tableaux
        if (rows.Count < 3)
        {
            foreach (var el in doc.QuerySelectorAll("li, p"))
            {
                var text = el.TextContent.Trim();
                var colonIdx = text.IndexOf(':');
                if (colonIdx > 2 && colonIdx < text.Length - 1 && colonIdx < 80)
                {
                    var key = text[..colonIdx].Trim();
                    var value = text[(colonIdx + 1)..].Trim();
                    if (!string.IsNullOrWhiteSpace(key) && !string.IsNullOrWhiteSpace(value) && key.Length < 100)
                        rows.Add(new SpecRow("Spécifications", key, value[..Math.Min(value.Length, 500)]));
                }
            }
        }

        return rows;
    }

    private static List<DocumentLink> ExtractDocuments(IDocument doc)
    {
        var docs = new List<DocumentLink>();
        var extensions = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            { ".pdf", ".docx", ".doc", ".zip", ".exe", ".dmg" };

        foreach (var link in doc.QuerySelectorAll("a[href]"))
        {
            var href = link.GetAttribute("href") ?? string.Empty;
            if (string.IsNullOrWhiteSpace(href)) continue;

            var ext = Path.GetExtension(href.Split('?')[0]);
            if (!extensions.Contains(ext)) continue;

            var title = link.TextContent.Trim();
            if (string.IsNullOrWhiteSpace(title)) title = Path.GetFileName(href.Split('?')[0]);

            var docType = ext.ToLowerInvariant() switch
            {
                ".pdf" => GuessDocType(title),
                ".docx" or ".doc" => "Manual",
                ".zip" or ".exe" or ".dmg" => "Driver",
                _ => "Other",
            };

            docs.Add(new DocumentLink(
                title[..Math.Min(title.Length, 200)],
                href[..Math.Min(href.Length, 500)],
                docType));
        }

        return docs;
    }

    private static string GuessDocType(string title)
    {
        var t = title.ToLowerInvariant();
        if (t.Contains("fiche") || t.Contains("datasheet") || t.Contains("spec")) return "Datasheet";
        if (t.Contains("manuel") || t.Contains("manual") || t.Contains("guide")) return "Manual";
        if (t.Contains("driver") || t.Contains("pilote")) return "Driver";
        if (t.Contains("garantie") || t.Contains("warranty")) return "Warranty";
        if (t.Contains("certificat") || t.Contains("cert")) return "Certificate";
        return "Datasheet";
    }

    private static string? ExtractVendorUrl(IDocument doc)
    {
        foreach (var link in doc.QuerySelectorAll("a[href]"))
        {
            var href = link.GetAttribute("href") ?? string.Empty;
            var text = link.TextContent.ToLowerInvariant();
            if (text.Contains("site") && text.Contains("fabricant") ||
                text.Contains("official") || text.Contains("manufacturer"))
            {
                if (href.StartsWith("http") && !href.Contains("techspace.ma"))
                    return href[..Math.Min(href.Length, 500)];
            }
        }
        return null;
    }
}

public record ParsedBody(List<SpecRow> Specs, List<DocumentLink> Documents, string? VendorUrl);

public record SpecRow(string Group, string Key, string Value);

public record DocumentLink(string Title, string Url, string DocType);
