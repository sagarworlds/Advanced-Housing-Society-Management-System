using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace SocietyManagement.Core.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(IdentityUser user, IList<string> roles, Guid? tenantId);
}
