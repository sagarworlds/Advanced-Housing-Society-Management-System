using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocietyManagement.Core.DTOs;
using SocietyManagement.Core.Entities.SaaS;
using SocietyManagement.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
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

        // Save selected modules
        if (request.SelectedModuleIds != null && request.SelectedModuleIds.Any())
        {
            var dbModules = await _context.Modules
                .Where(m => request.SelectedModuleIds.Contains(m.Name))
                .ToListAsync();

            foreach (var mod in dbModules)
            {
                _context.TenantModules.Add(new TenantModule
                {
                    TenantId = tenant.Id,
                    ModuleId = mod.Id,
                    IsActive = true,
                    ActivatedOn = DateTime.UtcNow
                });
            }
            await _context.SaveChangesAsync();
        }

        var adminUser = new IdentityUser { UserName = request.AdminEmail, Email = request.AdminEmail };
        var result = await _userManager.CreateAsync(adminUser, request.AdminPassword);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        await _userManager.AddToRoleAsync(adminUser, "SocietyAdmin");
        await _userManager.AddClaimAsync(adminUser, new System.Security.Claims.Claim("TenantId", tenant.Id.ToString()));

        return Ok(new { Message = "Society onboarded successfully", TenantId = tenant.Id });
    }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> GetAllSocieties()
    {
        var societies = await _context.Tenants
            .Include(t => t.TenantModules)
            .ThenInclude(tm => tm.Module)
            .Select(t => new
            {
                t.Id,
                t.Name,
                t.Domain,
                t.IsActive,
                t.CreatedAt,
                SelectedModuleIds = t.TenantModules.Where(tm => tm.IsActive).Select(tm => tm.Module.Name).ToList()
            })
            .ToListAsync();

        return Ok(societies);
    }

    [HttpPost("{id}/toggle")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> ToggleStatus(Guid id)
    {
        var tenant = await _context.Tenants.FindAsync(id);
        if (tenant == null) return NotFound("Society not found.");

        tenant.IsActive = !tenant.IsActive;
        await _context.SaveChangesAsync();

        return Ok(new { Message = $"Society status updated to {(tenant.IsActive ? "Active" : "Inactive")}", IsActive = tenant.IsActive });
    }

    [HttpPut("{id}/modules")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> UpdateModules(Guid id, [FromBody] List<string> selectedModuleNames)
    {
        var tenant = await _context.Tenants
            .Include(t => t.TenantModules)
            .ThenInclude(tm => tm.Module)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tenant == null) return NotFound("Society not found.");

        // Fetch all available modules from db
        var dbModules = await _context.Modules.ToListAsync();

        // Remove modules no longer selected
        var modulesToRemove = tenant.TenantModules
            .Where(tm => !selectedModuleNames.Contains(tm.Module.Name))
            .ToList();
        
        foreach (var tm in modulesToRemove)
        {
            _context.TenantModules.Remove(tm);
        }

        // Add new modules
        var existingModuleNames = tenant.TenantModules.Select(tm => tm.Module.Name).ToList();
        var modulesToAdd = dbModules
            .Where(m => selectedModuleNames.Contains(m.Name) && !existingModuleNames.Contains(m.Name))
            .ToList();

        foreach (var mod in modulesToAdd)
        {
            _context.TenantModules.Add(new TenantModule
            {
                TenantId = tenant.Id,
                ModuleId = mod.Id,
                IsActive = true,
                ActivatedOn = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();
        return Ok(new { Message = "Society subscription modules updated successfully" });
    }

    [HttpGet("modules")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> GetAvailableModules()
    {
        var modules = await _context.Modules
            .Select(m => new { m.Id, m.Name, m.Description, m.MonthlyPrice })
            .ToListAsync();

        return Ok(modules);
    }
}
