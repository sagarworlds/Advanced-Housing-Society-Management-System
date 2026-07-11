using SocietyManagement.Core.Entities.Base;

namespace SocietyManagement.Core.Entities;

public class Facility : TenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal HourlyRate { get; set; }
    public int MaxCapacity { get; set; }
}
