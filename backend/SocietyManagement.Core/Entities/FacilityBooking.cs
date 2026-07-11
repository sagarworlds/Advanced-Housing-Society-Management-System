using System;
using SocietyManagement.Core.Entities.Base;

namespace SocietyManagement.Core.Entities;

public class FacilityBooking : TenantEntity
{
    public Guid FacilityId { get; set; }
    public Facility? Facility { get; set; }
    
    public Guid FlatId { get; set; }
    public Flat? Flat { get; set; }

    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public string BookedByUserId { get; set; } = string.Empty;
}

public enum BookingStatus { Pending, Confirmed, Cancelled, Completed }
