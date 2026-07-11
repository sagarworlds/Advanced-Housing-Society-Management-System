using SocietyManagement.Core.Entities.Base;
using System;

namespace SocietyManagement.Core.Entities;

public class Visitor : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public Guid FlatId { get; set; }
    public Flat Flat { get; set; } = null!;
    public string Purpose { get; set; } = string.Empty;
    public string? PassCode { get; set; } // For pre-approved visitors
    public VisitorStatus Status { get; set; } = VisitorStatus.Pending;
    public DateTime ArrivalTime { get; set; } = DateTime.UtcNow;
    public DateTime? EntryTime { get; set; }
    public DateTime? ExitTime { get; set; }
}

public enum VisitorStatus
{
    Pending,
    Approved,
    Denied,
    Entered,
    Exited
}
