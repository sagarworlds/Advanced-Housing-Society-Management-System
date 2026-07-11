using System;
using System.Collections.Generic;
using SocietyManagement.Core.Entities.Base;

namespace SocietyManagement.Core.Entities;

public class Poll : TenantEntity
{
    public string Question { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public bool IsClosed { get; set; }
    public ICollection<PollOption> Options { get; set; } = new List<PollOption>();
}

public class PollOption : TenantEntity
{
    public Guid PollId { get; set; }
    public Poll? Poll { get; set; }
    public string Text { get; set; } = string.Empty;
    public ICollection<PollVote> Votes { get; set; } = new List<PollVote>();
}

public class PollVote : TenantEntity
{
    public Guid PollId { get; set; } 
    public Poll? Poll { get; set; }
    
    public Guid PollOptionId { get; set; }
    public PollOption? PollOption { get; set; }
    
    public Guid FlatId { get; set; }
    public Flat? Flat { get; set; }
}
