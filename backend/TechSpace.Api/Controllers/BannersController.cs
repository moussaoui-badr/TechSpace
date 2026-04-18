using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechSpace.Api.Data;
using TechSpace.Api.DTOs;

namespace TechSpace.Api.Controllers;

[ApiController]
[Route("api/banners")]
public class BannersController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<BannerDto>>> GetActive(CancellationToken ct)
    {
        var banners = await db.Banners
            .AsNoTracking()
            .Where(b => b.IsActive)
            .OrderBy(b => b.SortOrder)
            .Select(b => new BannerDto(b.Id, b.Title, b.Subtitle, b.ImageUrl, b.LinkUrl, b.CtaLabel))
            .ToListAsync(ct);

        return Ok(banners);
    }
}
