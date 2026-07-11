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
public class CommunicationController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CommunicationController(ApplicationDbContext context)
    {
        _context = context;
    }

    // --- NOTICES ---
    [HttpGet("notices")]
    public async Task<IActionResult> GetNotices()
    {
        var now = DateTime.UtcNow;
        var notices = await _context.Notices
            .Where(n => n.ExpiryDate == null || n.ExpiryDate > now)
            .OrderByDescending(n => n.IsUrgent)
            .ThenByDescending(n => n.CreatedAt)
            .ToListAsync();
            
        // Auto-seed demo notices
        if (!notices.Any())
        {
            var seedNotices = new[]
            {
                new Notice { Title = "Water Supply Interruption", Content = "Water supply will be stopped on Saturday from 2 PM to 5 PM for maintenance.", IsUrgent = true, ExpiryDate = now.AddDays(2) },
                new Notice { Title = "AGM Meeting", Content = "Annual General Meeting is scheduled for next month. Please clear all dues.", IsUrgent = false, ExpiryDate = now.AddDays(30) }
            };
            _context.Notices.AddRange(seedNotices);
            await _context.SaveChangesAsync();
            return Ok(seedNotices);
        }

        return Ok(notices);
    }

    [HttpPost("notices")]
    public async Task<IActionResult> CreateNotice([FromBody] Notice notice)
    {
        _context.Notices.Add(notice);
        await _context.SaveChangesAsync();
        return Ok(notice);
    }

    // --- POLLS ---
    [HttpGet("polls")]
    public async Task<IActionResult> GetPolls()
    {
        var polls = await _context.Polls
            .Include(p => p.Options)
            .ThenInclude(o => o.Votes)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
            
        // Auto-seed demo poll
        if (!polls.Any())
        {
            var poll = new Poll 
            { 
                Question = "Should we upgrade the Gym equipments?", 
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                Options = new[] 
                {
                    new PollOption { Text = "Yes, strictly needed." },
                    new PollOption { Text = "No, current ones are fine." }
                }
            };
            _context.Polls.Add(poll);
            await _context.SaveChangesAsync();
            polls.Add(poll);
        }

        // Map to DTO
        var result = polls.Select(p => new {
            p.Id,
            p.Question,
            p.ExpiryDate,
            p.IsClosed,
            Options = p.Options.Select(o => new {
                o.Id,
                o.Text,
                VoteCount = o.Votes.Count
            })
        });

        return Ok(result);
    }

    [HttpPost("polls")]
    public async Task<IActionResult> CreatePoll([FromBody] Poll poll)
    {
        _context.Polls.Add(poll);
        await _context.SaveChangesAsync();
        return Ok(poll);
    }

    [HttpPost("polls/{pollId}/vote")]
    public async Task<IActionResult> CastVote(Guid pollId, [FromBody] PollVote voteRequest)
    {
        var poll = await _context.Polls.FindAsync(pollId);
        if (poll == null) return NotFound("Poll not found");
        if (poll.IsClosed || poll.ExpiryDate < DateTime.UtcNow) return BadRequest("Poll is closed or expired.");

        // Setting a mock FlatId if one wasn't provided (for demo purposes)
        if (voteRequest.FlatId == Guid.Empty) 
        {
            var flat = await _context.Flats.FirstOrDefaultAsync();
            if (flat != null) voteRequest.FlatId = flat.Id;
            else return BadRequest("No flats found to vote from.");
        }

        // Critical Check: 1 vote per flat constraint
        var alreadyVoted = await _context.PollVotes
            .AnyAsync(v => v.PollId == pollId && v.FlatId == voteRequest.FlatId);

        if (alreadyVoted) 
            return Conflict(new { message = "Your flat has already cast a vote for this poll." });

        voteRequest.PollId = pollId;
        _context.PollVotes.Add(voteRequest);
        
        try 
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
             return Conflict(new { message = "Error saving vote.", details = ex.Message });
        }

        return Ok(voteRequest);
    }
}
