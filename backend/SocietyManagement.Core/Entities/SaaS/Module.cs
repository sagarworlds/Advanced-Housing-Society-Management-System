using System.Collections.Generic;
using SocietyManagement.Core.Entities.Base;

namespace SocietyManagement.Core.Entities.SaaS;

public class Module : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal MonthlyPrice { get; set; }
    
    public ICollection<TenantModule> TenantModules { get; set; } = new List<TenantModule>();
}
