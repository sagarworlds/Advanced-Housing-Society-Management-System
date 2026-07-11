using SocietyManagement.Core.Entities.Base;
using System;

namespace SocietyManagement.Core.Entities;

public class Invoice : TenantEntity
{
    public Guid FlatId { get; set; }
    public Flat Flat { get; set; } = null!;
    
    public string InvoiceNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal Penalty { get; set; }
    public DateTime DueDate { get; set; }
    public InvoiceStatus Status { get; set; } = InvoiceStatus.Unpaid;
    
    public string? PaymentReference { get; set; }
    public string? ScreenshotUrl { get; set; } // For manual bank transfer verifications
}

public enum InvoiceStatus
{
    Unpaid,
    PendingVerification,
    Paid,
    Overdue
}
