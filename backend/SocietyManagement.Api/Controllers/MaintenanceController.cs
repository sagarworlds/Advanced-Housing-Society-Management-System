using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocietyManagement.Core.Entities;
using SocietyManagement.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SocietyManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaintenanceController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MaintenanceController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("flats")]
    public async Task<IActionResult> GetFlats()
    {
        var flats = await _context.Flats.ToListAsync();
        return Ok(flats);
    }

    [HttpPost("flats")]
    public async Task<IActionResult> CreateFlat([FromBody] Flat flat)
    {
        _context.Flats.Add(flat);
        await _context.SaveChangesAsync();
        return Ok(flat);
    }

    [HttpGet("invoices")]
    public async Task<IActionResult> GetInvoices()
    {
        var invoices = await _context.Invoices.Include(i => i.Flat).ToListAsync();
        return Ok(invoices);
    }

    [HttpPost("invoices/generate")]
    public async Task<IActionResult> GenerateMonthlyInvoices()
    {
        var flats = await _context.Flats.ToListAsync();
        var invoices = new List<Invoice>();
        
        foreach (var flat in flats)
        {
            var invoice = new Invoice
            {
                FlatId = flat.Id,
                InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{flat.FlatNumber}",
                Amount = flat.MaintenanceAreaSqFt * 2.5m, // Dummy calculation
                DueDate = DateTime.UtcNow.AddDays(15),
                Status = InvoiceStatus.Unpaid
            };
            invoices.Add(invoice);
        }
        
        _context.Invoices.AddRange(invoices);
        await _context.SaveChangesAsync();
        
        return Ok(new { Message = $"Generated {invoices.Count} invoices" });
    }
}
