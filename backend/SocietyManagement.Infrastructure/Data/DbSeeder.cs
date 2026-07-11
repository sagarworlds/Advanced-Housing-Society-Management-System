using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocietyManagement.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedRolesAndSuperAdminAsync(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();

        // 1. Seed Roles
        string[] roles = { "SuperAdmin", "SocietyAdmin", "Resident", "SecurityGuard" };
        
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // 2. Seed Default Super Admin
        var superAdminEmail = "superadmin@admin.com";
        var superAdminUser = await userManager.FindByEmailAsync(superAdminEmail);

        if (superAdminUser == null)
        {
            var newSuperAdmin = new IdentityUser
            {
                UserName = superAdminEmail,
                Email = superAdminEmail,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(newSuperAdmin, "SuperAdmin123!");

            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(newSuperAdmin, "SuperAdmin");
            }
        }

        // 3. Seed Modules
        var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
        if (!context.Modules.Any())
        {
            var defaultModules = new List<SocietyManagement.Core.Entities.SaaS.Module>
            {
                new SocietyManagement.Core.Entities.SaaS.Module { Name = "maintenance", Description = "Maintenance & Billing", MonthlyPrice = 50.00m },
                new SocietyManagement.Core.Entities.SaaS.Module { Name = "visitors", Description = "Gate & Visitor Management", MonthlyPrice = 30.00m },
                new SocietyManagement.Core.Entities.SaaS.Module { Name = "amenities", Description = "Facility & Amenity Booking", MonthlyPrice = 20.00m },
                new SocietyManagement.Core.Entities.SaaS.Module { Name = "helpdesk", Description = "Helpdesk & Complaints", MonthlyPrice = 15.00m },
                new SocietyManagement.Core.Entities.SaaS.Module { Name = "communication", Description = "Notices & Polls", MonthlyPrice = 10.00m }
            };
            context.Modules.AddRange(defaultModules);
            await context.SaveChangesAsync();
        }
    }
}
