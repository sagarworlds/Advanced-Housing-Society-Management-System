using System;

namespace SocietyManagement.Core.Entities.Base;

public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ModifiedAt { get; set; }
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
}
