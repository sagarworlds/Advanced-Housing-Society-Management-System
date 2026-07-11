using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SocietyManagement.Core.DTOs;
using SocietyManagement.Core.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SocietyManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthController(
        UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        IJwtTokenService jwtTokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null) return Unauthorized("Invalid credentials.");

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded) return Unauthorized("Invalid credentials.");

        var roles = await _userManager.GetRolesAsync(user);
        
        // Note: Real implementation will map TenantId from the custom user profile
        Guid? tenantId = null; 

        var token = _jwtTokenService.GenerateToken(user, roles, tenantId);

        return Ok(new AuthResponse
        {
            Token = token,
            Email = user.Email!,
            Role = roles.FirstOrDefault() ?? "User",
            TenantId = tenantId
        });
    }

    [HttpPost("register/resident")]
    public async Task<IActionResult> RegisterResident([FromBody] RegisterResidentRequest request)
    {
        var user = new IdentityUser { UserName = request.Email, Email = request.Email };
        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded) return BadRequest(result.Errors);

        // Note: Add to Resident role and create Resident profile here

        return Ok(new { Message = "Resident registered successfully, pending admin approval." });
    }
}
