using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MySalon.Application.Interfaces.Repositories;
using MySalon.Application.Interfaces.Services;
using MySalon.Application.Services;
using MySalon.Domain.Entities;
using MySalon.Infrastructure.Data;
using MySalon.Infrastructure.Repositories;
using MySalon.Infrastructure.Services;
using MySalon.Infrastructure.Settings;

namespace MySalon.Infrastructure.Extensions
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<MySalonDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<ApplicationUser, IdentityRole>().AddEntityFrameworkStores<MySalonDbContext>().AddDefaultTokenProviders();

            services.AddHttpContextAccessor();
            services.AddScoped<ISalonRepository, SalonRepository>();
            services.AddScoped<IServiceRepository, ServiceRepository>();
            services.AddScoped<ISalonServiceRepository, SalonServiceRepository>();
            services.AddScoped<IStylistRepository, StylistRepository>();
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<IStylistWorkHoursRepository, StylistWorkHoursRepository>();
            services.AddScoped<IBookingRepository, BookingRepository>();
            services.AddScoped<IDashboardRepository, DashboardRepository>();


            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<ISalonAppService, SalonAppService>();
            services.AddScoped<IServiceAppService, ServiceAppService>();
            services.AddScoped<ISalonServiceAppService, SalonServiceAppService>();
            services.AddScoped<IStylistAppService, StylistAppService>();
            services.AddScoped<ICustomerAppService, CustomerAppService>();
            services.AddScoped<IBookingAppService, BookingAppService>();
            services.AddScoped<IStylistWorkHourAppService, StylistWorkHoursAppService>();
            services.AddScoped<IDashboardAppService, DashboardAppService>();

            services.AddScoped<IFileService, LocalFileService>();

            services.Configure<CloudinarySettings>(configuration.GetSection("CloudinarySettings"));

            services.AddScoped<IPhotoService, PhotoService>();

            return services;
        }
    }
}