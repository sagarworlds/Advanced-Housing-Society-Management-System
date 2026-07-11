using System.Collections.Generic;
using SocietyManagement.Core.Entities.Base;

namespace SocietyManagement.Core.Entities.SaaS;

public class Tenant : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Domain { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    
    public bool IsActive { get; set; } = true;
    public ICollection<TenantModule> TenantModules { get; set; } = new List<TenantModule>();
}
