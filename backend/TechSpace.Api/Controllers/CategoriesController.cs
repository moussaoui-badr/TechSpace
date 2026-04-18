using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechSpace.Api.Data;
using TechSpace.Api.DTOs;

namespace TechSpace.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CategoryDto>>> GetTree(CancellationToken ct)
    {
        var flat = await db.Categories
            .AsNoTracking()
            .OrderBy(c => c.Id)
            .ToListAsync(ct);

        var byId = flat.ToDictionary(c => c.Id, c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Slug = c.Slug,
            Description = c.Description,
            ImageUrl = c.ImageUrl,
            ParentId = c.ParentId,
            Children = [],
        });

        var tree = new List<CategoryDto>();
        foreach (var entity in flat)
        {
            var dto = byId[entity.Id];
            if (entity.ParentId is null)
            {
                tree.Add(dto);
            }
            else if (byId.TryGetValue(entity.ParentId.Value, out var parent))
            {
                parent.Children.Add(dto);
            }
        }

        return Ok(tree);
    }
}
