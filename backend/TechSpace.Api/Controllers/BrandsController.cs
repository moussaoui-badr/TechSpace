using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechSpace.Api.Data;
using TechSpace.Api.DTOs;

namespace TechSpace.Api.Controllers;

[ApiController]
[Route("api/brands")]
public class BrandsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<BrandDto>>> GetAll(CancellationToken ct)
    {
        var brands = await db.Brands
            .AsNoTracking()
            .OrderBy(b => b.Name)
            .Select(b => new BrandDto(b.Id, b.Name, b.Slug, b.LogoUrl))
            .ToListAsync(ct);

        return Ok(brands);
    }
}
