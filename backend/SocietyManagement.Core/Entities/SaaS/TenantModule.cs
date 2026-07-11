using System;
using SocietyManagement.Core.Entities.Base;

namespace SocietyManagement.Core.Entities.SaaS;

public class TenantModule : BaseEntity
{
    public Guid TenantId { get; set; }
    public Tenant Tenant { get; set; } = null!;
    
    public Guid ModuleId { get; set; }
    public Module Module { get; set; } = null!;
    
    public bool IsActive { get; set; } = true;
    public DateTime ActivatedOn { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiryDate { get; set; }
}
