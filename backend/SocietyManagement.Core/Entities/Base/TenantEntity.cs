using System;

namespace SocietyManagement.Core.Entities.Base;

public abstract class TenantEntity : BaseEntity
{
    public Guid TenantId { get; set; }
}
