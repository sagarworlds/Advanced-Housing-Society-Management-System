using System;
using SocietyManagement.Core.Entities.Base;

namespace SocietyManagement.Core.Entities;

public class Notice : TenantEntity
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime? ExpiryDate { get; set; }
    public bool IsUrgent { get; set; }
}
