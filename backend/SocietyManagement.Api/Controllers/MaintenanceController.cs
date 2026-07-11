using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocietyManagement.Core.DTOs;
using SocietyManagement.Core.Entities;
using SocietyManagement.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SocietyManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaintenanceController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;

    public MaintenanceController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // ── Flats ─────────────────────────────────────────────────────────────────

    [HttpGet("flats")]
    public async Task<IActionResult> GetFlats()
    {
        var flats = await _context.Flats.OrderBy(f => f.Block).ThenBy(f => f.FlatNumber).ToListAsync();
        return Ok(flats);
    }

    [HttpGet("flats/{id}")]
    public async Task<IActionResult> GetFlat(Guid id)
    {
        var flat = await _context.Flats.FindAsync(id);
        if (flat == null) return NotFound();
        return Ok(flat);
    }

    [HttpPost("flats")]
    [Authorize(Roles = "SocietyAdmin,SuperAdmin")]
    public async Task<IActionResult> CreateFlat([FromBody] FlatRequest request)
    {
        var flat = new Flat
        {
            Block               = request.Block,
            FlatNumber          = request.FlatNumber,
            Floor               = request.Floor,
            FlatType            = request.FlatType,
            OwnerName           = request.OwnerName,
            OwnerPhone          = request.OwnerPhone,
            OwnerEmail          = request.OwnerEmail,
            OccupancyStatus     = request.OccupancyStatus,
            MaintenanceAreaSqFt = request.MaintenanceAreaSqFt
        };

        // Auto-create a Resident user account when occupancy is "Owner"
        string? autoCreatedEmail = null;
        if (request.OccupancyStatus == "Owner" && !string.IsNullOrWhiteSpace(request.OwnerEmail))
        {
            var existingUser = await _userManager.FindByEmailAsync(request.OwnerEmail);
            if (existingUser == null)
            {
                var newUser = new IdentityUser
                {
                    UserName = request.OwnerEmail,
                    Email    = request.OwnerEmail,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(newUser, "Password!23");
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(newUser, "Resident");
                    flat.ResidentUserId = newUser.Id;
                    autoCreatedEmail = request.OwnerEmail;
                }
                else
                {
                    return BadRequest(new
                    {
                        Message = "Could not create user account for the owner.",
                        Errors  = result.Errors.Select(e => e.Description)
                    });
                }
            }
            else
            {
                // User already exists — link them
                flat.ResidentUserId = existingUser.Id;
            }
        }

        _context.Flats.Add(flat);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            Flat            = flat,
            UserCreated     = autoCreatedEmail != null,
            Username        = autoCreatedEmail, // The email is the username for login
            DefaultPassword = autoCreatedEmail != null ? "Password!23" : null,
            Message         = autoCreatedEmail != null
                ? $"Flat added and resident account created with email {autoCreatedEmail}"
                : "Flat added successfully."
        });
    }

    [HttpPut("flats/{id}")]
    [Authorize(Roles = "SocietyAdmin,SuperAdmin")]
    public async Task<IActionResult> UpdateFlat(Guid id, [FromBody] FlatRequest request)
    {
        var flat = await _context.Flats.FindAsync(id);
        if (flat == null) return NotFound("Flat not found.");

        flat.Block               = request.Block;
        flat.FlatNumber          = request.FlatNumber;
        flat.Floor               = request.Floor;
        flat.FlatType            = request.FlatType;
        flat.OwnerName           = request.OwnerName;
        flat.OwnerPhone          = request.OwnerPhone;
        flat.OwnerEmail          = request.OwnerEmail;
        flat.OccupancyStatus     = request.OccupancyStatus;
        flat.MaintenanceAreaSqFt = request.MaintenanceAreaSqFt;

        await _context.SaveChangesAsync();
        return Ok(flat);
    }

    [HttpDelete("flats/{id}")]
    [Authorize(Roles = "SocietyAdmin,SuperAdmin")]
    public async Task<IActionResult> DeleteFlat(Guid id)
    {
        var flat = await _context.Flats.FindAsync(id);
        if (flat == null) return NotFound("Flat not found.");

        _context.Flats.Remove(flat);
        await _context.SaveChangesAsync();
        return Ok(new { Message = "Flat deleted successfully." });
    }

    // ── Invoices ──────────────────────────────────────────────────────────────

    [HttpGet("invoices")]
    public async Task<IActionResult> GetInvoices()
    {
        var invoices = await _context.Invoices.Include(i => i.Flat).ToListAsync();
        return Ok(invoices);
    }

    [HttpPost("invoices/generate")]
    [Authorize(Roles = "SocietyAdmin,SuperAdmin")]
    public async Task<IActionResult> GenerateMonthlyInvoices()
    {
        var flats   = await _context.Flats.ToListAsync();
        var invoices = new List<Invoice>();

        foreach (var flat in flats)
        {
            var invoice = new Invoice
            {
                FlatId        = flat.Id,
                InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{flat.FlatNumber}",
                Amount        = flat.MaintenanceAreaSqFt * 2.5m,
                DueDate       = DateTime.UtcNow.AddDays(15),
                Status        = InvoiceStatus.Unpaid
            };
            invoices.Add(invoice);
        }

        _context.Invoices.AddRange(invoices);
        await _context.SaveChangesAsync();

        return Ok(new { Message = $"Generated {invoices.Count} invoices" });
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /// <summary>
    /// Builds a username from the owner's full name.
    /// "Sagar Patil" → "sagar-patil"
    /// Strips non-alphanumeric characters and lowercases everything.
    /// </summary>
    private static string BuildUsername(string fullName)
    {
        var parts = fullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var slug  = string.Join("-", parts.Select(p => Regex.Replace(p, @"[^a-zA-Z0-9]", "").ToLower()));
        return string.IsNullOrEmpty(slug) ? "resident" : slug;
    }
}
