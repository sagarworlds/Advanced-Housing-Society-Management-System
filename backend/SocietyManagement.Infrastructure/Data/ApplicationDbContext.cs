using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SocietyManagement.Core.Entities;
using SocietyManagement.Core.Entities.Base;
using SocietyManagement.Core.Entities.SaaS;
using SocietyManagement.Core.Interfaces;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SocietyManagement.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    private readonly ITenantProvider _tenantProvider;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        ITenantProvider tenantProvider) : base(options)
    {
        _tenantProvider = tenantProvider;
    }

    public DbSet<Tenant> Tenants { get; set; } = null!;
    public DbSet<Module> Modules { get; set; } = null!;
    public DbSet<TenantModule> TenantModules { get; set; } = null!;
    public DbSet<Flat> Flats { get; set; } = null!;
    public DbSet<Invoice> Invoices { get; set; } = null!;
    public DbSet<Visitor> Visitors { get; set; } = null!;
    public DbSet<Ticket> Tickets { get; set; } = null!;
    public DbSet<Facility> Facilities { get; set; } = null!;
    public DbSet<FacilityBooking> FacilityBookings { get; set; } = null!;
    public DbSet<Notice> Notices { get; set; } = null!;
    public DbSet<Poll> Polls { get; set; } = null!;
    public DbSet<PollOption> PollOptions { get; set; } = null!;
    public DbSet<PollVote> PollVotes { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Setup Concurrency tokens for offline sync delta
        builder.Entity<Tenant>().Property(e => e.RowVersion).IsConcurrencyToken();
        builder.Entity<Module>().Property(e => e.RowVersion).IsConcurrencyToken();
        builder.Entity<TenantModule>().Property(e => e.RowVersion).IsConcurrencyToken();
        builder.Entity<Flat>().Property(e => e.RowVersion).IsConcurrencyToken();
        builder.Entity<Invoice>().Property(e => e.RowVersion).IsConcurrencyToken();
        builder.Entity<Visitor>().Property(e => e.RowVersion).IsConcurrencyToken();
        builder.Entity<Ticket>().Property(e => e.RowVersion).IsConcurrencyToken();
        builder.Entity<Facility>().Property(e => e.RowVersion).IsConcurrencyToken();
        builder.Entity<FacilityBooking>().Property(e => e.RowVersion).IsConcurrencyToken();
        builder.Entity<Notice>().Property(e => e.RowVersion).IsConcurrencyToken();
        builder.Entity<Poll>().Property(e => e.RowVersion).IsConcurrencyToken();
        builder.Entity<PollOption>().Property(e => e.RowVersion).IsConcurrencyToken();
        builder.Entity<PollVote>().Property(e => e.RowVersion).IsConcurrencyToken();
        
        // Ensure unique module names
        builder.Entity<Module>().HasIndex(m => m.Name).IsUnique();

        // Query Filters (dynamic per-request evaluation, bypasses if tenant ID is null / SuperAdmin)
        builder.Entity<Flat>().HasQueryFilter(e => _tenantProvider.GetTenantId() == null || e.TenantId == _tenantProvider.GetTenantId());
        builder.Entity<Invoice>().HasQueryFilter(e => _tenantProvider.GetTenantId() == null || e.TenantId == _tenantProvider.GetTenantId());
        builder.Entity<Visitor>().HasQueryFilter(e => _tenantProvider.GetTenantId() == null || e.TenantId == _tenantProvider.GetTenantId());
        builder.Entity<Ticket>().HasQueryFilter(e => _tenantProvider.GetTenantId() == null || e.TenantId == _tenantProvider.GetTenantId());
        builder.Entity<Facility>().HasQueryFilter(e => _tenantProvider.GetTenantId() == null || e.TenantId == _tenantProvider.GetTenantId());
        builder.Entity<FacilityBooking>().HasQueryFilter(e => _tenantProvider.GetTenantId() == null || e.TenantId == _tenantProvider.GetTenantId());
        builder.Entity<Notice>().HasQueryFilter(e => _tenantProvider.GetTenantId() == null || e.TenantId == _tenantProvider.GetTenantId());
        builder.Entity<Poll>().HasQueryFilter(e => _tenantProvider.GetTenantId() == null || e.TenantId == _tenantProvider.GetTenantId());
        builder.Entity<PollOption>().HasQueryFilter(e => _tenantProvider.GetTenantId() == null || e.TenantId == _tenantProvider.GetTenantId());
        builder.Entity<PollVote>().HasQueryFilter(e => _tenantProvider.GetTenantId() == null || e.TenantId == _tenantProvider.GetTenantId());

        // Configure Invoice -> Flat relationship
        builder.Entity<Invoice>()
            .HasOne(i => i.Flat)
            .WithMany()
            .HasForeignKey(i => i.FlatId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Visitor -> Flat relationship
        builder.Entity<Visitor>()
            .HasOne(v => v.Flat)
            .WithMany()
            .HasForeignKey(v => v.FlatId)
            .OnDelete(DeleteBehavior.Restrict);
    }
    
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
                entry.Entity.RowVersion = Guid.NewGuid().ToByteArray();
            }
            if (entry.State == EntityState.Modified)
            {
                entry.Entity.ModifiedAt = DateTime.UtcNow;
                entry.Entity.RowVersion = Guid.NewGuid().ToByteArray();
            }
            
            // For TenantEntity, enforce TenantId if available
            if (entry.Entity is TenantEntity tenantEntity && _tenantProvider.GetTenantId().HasValue)
            {
                 if (entry.State == EntityState.Added && tenantEntity.TenantId == Guid.Empty)
                 {
                     tenantEntity.TenantId = _tenantProvider.GetTenantId().Value;
                 }
            }
        }
        return base.SaveChangesAsync(cancellationToken);
    }
}
