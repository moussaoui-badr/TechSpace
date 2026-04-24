using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TechSpace.Api.DTOs.Auth;
using TechSpace.Api.Models;

namespace TechSpace.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    UserManager<AppUser> userManager,
    SignInManager<AppUser> signInManager) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = new AppUser
        {
            UserName = req.Email,
            Email = req.Email,
            FirstName = req.FirstName,
            LastName = req.LastName,
            Phone = req.Phone,
            CreatedAt = DateTime.UtcNow,
        };

        var result = await userManager.CreateAsync(user, req.Password);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        await userManager.AddToRoleAsync(user, "Customer");
        await signInManager.SignInAsync(user, isPersistent: false);

        return Ok(await BuildDtoAsync(user));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await signInManager.PasswordSignInAsync(
            req.Email, req.Password, req.RememberMe, lockoutOnFailure: false);

        if (!result.Succeeded)
            return Unauthorized(new { message = "Email ou mot de passe incorrect." });

        var user = await userManager.FindByEmailAsync(req.Email);
        if (user is null) return Unauthorized();

        return Ok(await BuildDtoAsync(user));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();
        return Ok(await BuildDtoAsync(user));
    }

    private async Task<AuthUserDto> BuildDtoAsync(AppUser user)
    {
        var roles = await userManager.GetRolesAsync(user);
        return new AuthUserDto(
            user.Id.ToString(),
            user.Email ?? string.Empty,
            user.FirstName,
            user.LastName,
            user.Phone,
            roles
        );
    }
}
