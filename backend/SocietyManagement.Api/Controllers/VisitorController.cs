using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SocietyManagement.Api.Hubs;
using SocietyManagement.Core.Entities;
using SocietyManagement.Infrastructure.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SocietyManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VisitorController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IHubContext<VisitorHub> _hubContext;

    public VisitorController(ApplicationDbContext context, IHubContext<VisitorHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetVisitors()
    {
        var visitors = await _context.Visitors.Include(v => v.Flat).OrderByDescending(v => v.ArrivalTime).ToListAsync();
        return Ok(visitors);
    }

    [HttpPost("arrive")]
    public async Task<IActionResult> VisitorArrived([FromBody] Visitor visitor)
    {
        visitor.Status = VisitorStatus.Pending;
        visitor.ArrivalTime = DateTime.UtcNow;
        
        _context.Visitors.Add(visitor);
        await _context.SaveChangesAsync();

        // Broadcast to specific flat for resident approval
        await _hubContext.Clients.Group($"Flat_{visitor.FlatId}").SendAsync("VisitorArrived", visitor);
        
        return Ok(visitor);
    }

    [HttpPost("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateVisitorStatusRequest request)
    {
        var visitor = await _context.Visitors.FindAsync(id);
        if (visitor == null) return NotFound();

        visitor.Status = request.Status;
        if (request.Status == VisitorStatus.Entered) visitor.EntryTime = DateTime.UtcNow;
        if (request.Status == VisitorStatus.Exited) visitor.ExitTime = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Broadcast back to all guards (and potentially flat)
        await _hubContext.Clients.All.SendAsync("VisitorStatusUpdated", visitor);

        return Ok(visitor);
    }
}

public class UpdateVisitorStatusRequest
{
    public VisitorStatus Status { get; set; }
}
