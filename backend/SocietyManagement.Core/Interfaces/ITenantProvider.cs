using System;

namespace SocietyManagement.Core.Interfaces;

public interface ITenantProvider
{
    Guid? GetTenantId();
}
