using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using MySalon.Domain.Entities; 
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MySalon.Infrastructure.Data
{
    public static class DbInitializer
    {
        public static async Task SeedRolesAndAdminAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            string[] roleNames = { "Admin", "Owner", "Stylist", "Customer" };
            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            string adminEmail = "admin@mysalon.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                var newAdmin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "مدير",
                    LastName = "النظام",
                    EmailConfirmed = true
                };

                var createPowerUser = await userManager.CreateAsync(newAdmin, "Admin@123456!");
                if (createPowerUser.Succeeded)
                {
                    await userManager.AddToRoleAsync(newAdmin, "Admin");
                    Console.WriteLine("✅ تمت إضافة حساب المدير بنجاح!");
                }
                else
                {
                    var errors = string.Join(", ", createPowerUser.Errors.Select(e => e.Description));
                    Console.WriteLine($"❌ فشل إنشاء حساب المدير: {errors}");
                }
            }
        }
    }
}