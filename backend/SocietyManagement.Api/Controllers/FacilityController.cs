using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocietyManagement.Core.Entities;
using SocietyManagement.Infrastructure.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SocietyManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FacilityController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FacilityController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetFacilities()
    {
        var facilities = await _context.Facilities.ToListAsync();
        
        // Auto-seed some facilities if none exist for demo purposes
        if (!facilities.Any())
        {
            _context.Facilities.AddRange(
                new Facility { Name = "Clubhouse", Description = "Main clubhouse for events", HourlyRate = 500, MaxCapacity = 100 },
                new Facility { Name = "Tennis Court", Description = "Standard tennis court", HourlyRate = 100, MaxCapacity = 4 },
                new Facility { Name = "Swimming Pool", Description = "Community pool", HourlyRate = 0, MaxCapacity = 30 }
            );
            await _context.SaveChangesAsync();
            facilities = await _context.Facilities.ToListAsync();
        }

        return Ok(facilities);
    }

    [HttpPost]
    public async Task<IActionResult> CreateFacility([FromBody] Facility facility)
    {
        _context.Facilities.Add(facility);
        await _context.SaveChangesAsync();
        return Ok(facility);
    }

    [HttpGet("bookings")]
    public async Task<IActionResult> GetBookings([FromQuery] Guid? facilityId, [FromQuery] DateTime? date)
    {
        var query = _context.FacilityBookings.Include(b => b.Facility).AsQueryable();
        
        if (facilityId.HasValue) query = query.Where(b => b.FacilityId == facilityId.Value);
        
        if (date.HasValue) 
        {
            var startOfDay = date.Value.Date;
            var endOfDay = startOfDay.AddDays(1);
            query = query.Where(b => b.StartTime >= startOfDay && b.StartTime < endOfDay);
        }

        var bookings = await query.OrderBy(b => b.StartTime).ToListAsync();
        return Ok(bookings);
    }

    [HttpPost("book")]
    public async Task<IActionResult> BookFacility([FromBody] FacilityBooking request)
    {
        // 1. First-pass check for overlapping time windows
        var conflict = await _context.FacilityBookings
            .AnyAsync(b => b.FacilityId == request.FacilityId 
                        && b.Status != BookingStatus.Cancelled
                        && b.StartTime < request.EndTime 
                        && b.EndTime > request.StartTime);
                        
        if (conflict) return Conflict(new { message = "This time slot is already booked." });

        request.Status = BookingStatus.Confirmed;
        request.BookedByUserId = "Resident_1"; // Mock User ID
        
        // Setting a mock FlatId if one wasn't provided (for demo purposes)
        if (request.FlatId == Guid.Empty) 
        {
            var flat = await _context.Flats.FirstOrDefaultAsync();
            if (flat != null) request.FlatId = flat.Id;
        }
        
        _context.FacilityBookings.Add(request);

        try
        {
            // 2. EF Core Optimistic Concurrency check
            // If two requests pass the conflict check above at the exact same millisecond,
            // the database transaction will only allow one to proceed if configured correctly,
            // or we'd get a DbUpdateConcurrencyException if updating the same row.
            // (For inserts, unique constraints are better, but RowVersion protects updates).
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            return Conflict(new { message = "Database conflict. Please try again.", details = ex.Message });
        }

        return Ok(request);
    }
}
