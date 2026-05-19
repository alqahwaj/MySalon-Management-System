using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore; 
using MySalon.Domain.Entities;

namespace MySalon.Infrastructure.Data
{
    public class MySalonDbContext : IdentityDbContext<ApplicationUser>
    {
        public MySalonDbContext(DbContextOptions<MySalonDbContext> options) : base(options)
        {
        }

        public DbSet<Salon> Salons { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<SalonImage> SalonImages { get; set; }
        public DbSet<SalonService> SalonServices { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Stylist> Stylists { get; set; }
        public DbSet<StylistWorkHours> StylistWorkHours { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<Booking>()
                .Property(b => b.TotalPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SalonService>()
                .Property(s => s.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Customer>()
                .HasIndex(c => c.Email)
                .IsUnique();

            modelBuilder.Entity<Stylist>()
                .HasIndex(s => s.Email)
                .IsUnique();

            modelBuilder.Entity<Salon>()
                .HasIndex(s => s.Email)
                .IsUnique();

            modelBuilder.Entity<StylistWorkHours>()
                .HasIndex(x => new { x.StylistId, x.DayOfWeek })
                .IsUnique();

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Customer)
                .WithMany(c => c.Bookings)
                .HasForeignKey(b => b.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Stylist)
                .WithMany(b => b.Bookings)
                .HasForeignKey(b => b.StylistId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Salon)
                .WithMany(b => b.Bookings)
                .HasForeignKey(b => b.SalonId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.SalonService)
                .WithMany()
                .HasForeignKey(b => b.SalonServiceId)
                .OnDelete(DeleteBehavior.Restrict);


            var defaultSalonId = Guid.Parse("5A344038-03D9-4840-9D4A-54E7E9F24531");

            modelBuilder.Entity<Salon>().HasData(
                new Salon
                {
                    ID = defaultSalonId,
                    Name = "MySalon",
                    Address = "Amman, Jordan",
                    PhoneNumber = "0790000000",
                    Email = "admin@mysalon.com",
                    Description = "نظام إدارة الصالونات المتكامل",
                    CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    IsDeleted = false
                }
            );

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                {
                    modelBuilder.Entity(entityType.ClrType)
                        .HasQueryFilter(GetIsDeletedRestriction(entityType.ClrType));
                }
            }
        }

        private static System.Linq.Expressions.LambdaExpression GetIsDeletedRestriction(Type type)
        {
            var parm = System.Linq.Expressions.Expression.Parameter(type, "it");
            var prop = System.Linq.Expressions.Expression.Call(typeof(EF), nameof(EF.Property), new[] { typeof(bool) }, parm, System.Linq.Expressions.Expression.Constant("IsDeleted"));
            var condition = System.Linq.Expressions.Expression.Equal(prop, System.Linq.Expressions.Expression.Constant(false));
            return System.Linq.Expressions.Expression.Lambda(condition, parm);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.UtcNow;
                        break;

                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        break;

                    case EntityState.Deleted:
                        entry.State = EntityState.Modified;
                        entry.Entity.IsDeleted = true;
                        entry.Entity.DeletedAt = DateTime.UtcNow;
                        break;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}