using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechSpace.Api.Data;
using TechSpace.Api.DTOs.Auth;
using TechSpace.Api.Models;

namespace TechSpace.Api.Controllers;

[ApiController]
[Route("api/addresses")]
[Authorize]
public class AddressesController(
    AppDbContext db,
    UserManager<AppUser> userManager) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List()
    {
        var userId = GetUserId();
        var addresses = await db.Addresses
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.IsDefault)
            .ThenBy(a => a.Label)
            .Select(a => ToDto(a))
            .ToListAsync();
        return Ok(addresses);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertAddressRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userId = GetUserId();

        if (req.IsDefault)
            await ClearDefaultAsync(userId);

        var address = new Address
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Label = req.Label,
            FullName = req.FullName,
            Phone = req.Phone,
            Line1 = req.Line1,
            Line2 = req.Line2,
            City = req.City,
            PostalCode = req.PostalCode,
            Country = req.Country,
            IsDefault = req.IsDefault,
        };

        db.Addresses.Add(address);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(List), ToDto(address));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpsertAddressRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userId = GetUserId();
        var address = await db.Addresses.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
        if (address is null) return NotFound();

        if (req.IsDefault && !address.IsDefault)
            await ClearDefaultAsync(userId);

        address.Label = req.Label;
        address.FullName = req.FullName;
        address.Phone = req.Phone;
        address.Line1 = req.Line1;
        address.Line2 = req.Line2;
        address.City = req.City;
        address.PostalCode = req.PostalCode;
        address.Country = req.Country;
        address.IsDefault = req.IsDefault;

        await db.SaveChangesAsync();
        return Ok(ToDto(address));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();
        var address = await db.Addresses.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
        if (address is null) return NotFound();

        db.Addresses.Remove(address);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id:guid}/default")]
    public async Task<IActionResult> SetDefault(Guid id)
    {
        var userId = GetUserId();
        var address = await db.Addresses.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
        if (address is null) return NotFound();

        await ClearDefaultAsync(userId);
        address.IsDefault = true;
        await db.SaveChangesAsync();
        return Ok(ToDto(address));
    }

    private Guid GetUserId()
    {
        var idClaim = userManager.GetUserId(User)
            ?? throw new InvalidOperationException("Utilisateur non authentifié.");
        return Guid.Parse(idClaim);
    }

    private async Task ClearDefaultAsync(Guid userId)
    {
        await db.Addresses
            .Where(a => a.UserId == userId && a.IsDefault)
            .ExecuteUpdateAsync(s => s.SetProperty(a => a.IsDefault, false));
    }

    private static AddressDto ToDto(Address a) =>
        new(a.Id.ToString(), a.Label, a.FullName, a.Phone,
            a.Line1, a.Line2, a.City, a.PostalCode, a.Country, a.IsDefault);
}
