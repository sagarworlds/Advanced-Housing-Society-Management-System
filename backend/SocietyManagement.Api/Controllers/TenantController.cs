using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SocietyManagement.Core.DTOs;
using SocietyManagement.Core.Entities.SaaS;
using SocietyManagement.Infrastructure.Data;
using System.Threading.Tasks;

namespace SocietyManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TenantController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public TenantController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpPost("onboard")]
    public async Task<IActionResult> OnboardSociety([FromBody] SocietyOnboardingRequest request)
    {
        var tenant = new Tenant
        {
            Name = request.SocietyName,
            Domain = request.Domain
        };

        _context.Tenants.Add(tenant);
        await _context.SaveChangesAsync();

        var adminUser = new IdentityUser { UserName = request.AdminEmail, Email = request.AdminEmail };
        var result = await _userManager.CreateAsync(adminUser, request.AdminPassword);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        // Note: Assign "Society Admin" role and link user to TenantId here.

        return Ok(new { Message = "Society onboarded successfully", TenantId = tenant.Id });
    }
}
