using SocietyManagement.Core.Entities.Base;

namespace SocietyManagement.Core.Entities;

public class Flat : TenantEntity
{
    public string Block { get; set; } = string.Empty;
    public string FlatNumber { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string? ResidentUserId { get; set; }
    public decimal MaintenanceAreaSqFt { get; set; }
}
