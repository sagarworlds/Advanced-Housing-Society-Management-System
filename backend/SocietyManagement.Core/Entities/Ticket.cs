using SocietyManagement.Core.Entities.Base;

namespace SocietyManagement.Core.Entities;

public class Ticket : TenantEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TicketCategory Category { get; set; } = TicketCategory.Other;
    public TicketStatus Status { get; set; } = TicketStatus.Open;
    public TicketPriority Priority { get; set; } = TicketPriority.Medium;
    
    public string CreatedByUserId { get; set; } = string.Empty;
    public string? AssignedToUserId { get; set; }
    public string? AttachmentUrl { get; set; }
}

public enum TicketCategory { Plumbing, Electrical, Cleaning, Security, Other }
public enum TicketStatus { Open, Assigned, InProgress, Resolved, Closed }
public enum TicketPriority { Low, Medium, High, Critical }
