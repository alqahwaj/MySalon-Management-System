using Microsoft.EntityFrameworkCore;
using MySalon.Application.DTOs.Dashboard;
using MySalon.Application.Interfaces.Repositories;
using MySalon.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MySalon.Infrastructure.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly MySalonDbContext _context;

        public DashboardRepository(MySalonDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var now = DateTime.UtcNow;
            var currentMonthStart = new DateTime(now.Year, now.Month, 1);
            var lastMonthStart = currentMonthStart.AddMonths(-1);

            var (currentRevenue, lastRevenue) = await GetRevenueStatsAsync(currentMonthStart, lastMonthStart);
            var (currentBookings, lastBookings) = await GetBookingStatsAsync(currentMonthStart, lastMonthStart);
            var (currentCustomers, lastCustomers) = await GetCustomerStatsAsync(currentMonthStart, lastMonthStart);

            var activeStylists = await _context.Stylists.CountAsync();
            var recentBookings = await GetRecentBookingsAsync();

            return new DashboardStatsDto
            {
                TotalRevenue = currentRevenue,
                RevenuePercentage = CalculatePercentage(currentRevenue, lastRevenue),

                TotalBookings = currentBookings,
                BookingsPercentage = CalculatePercentage(currentBookings, lastBookings),

                NewCustomers = currentCustomers,
                CustomersPercentage = CalculatePercentage(currentCustomers, lastCustomers),

                ActiveStylists = activeStylists,
                RecentBookings = recentBookings 
            };
        }


        private async Task<(decimal current, decimal last)> GetRevenueStatsAsync(DateTime currentMonthStart, DateTime lastMonthStart)
        {
            var currentRevenue = await _context.Bookings
                .Where(b => b.CreatedAt >= currentMonthStart)
                .SumAsync(b => b.TotalPrice); 

            var lastRevenue = await _context.Bookings
                .Where(b => b.CreatedAt >= lastMonthStart && b.CreatedAt < currentMonthStart)
                .SumAsync(b => b.TotalPrice);

            return (currentRevenue, lastRevenue);
        }

        private async Task<(int current, int last)> GetBookingStatsAsync(DateTime currentMonthStart, DateTime lastMonthStart)
        {
            var currentBookings = await _context.Bookings.CountAsync(b => b.CreatedAt >= currentMonthStart);
            var lastBookings = await _context.Bookings.CountAsync(b => b.CreatedAt >= lastMonthStart && b.CreatedAt < currentMonthStart);

            return (currentBookings, lastBookings);
        }

        private async Task<(int current, int last)> GetCustomerStatsAsync(DateTime currentMonthStart, DateTime lastMonthStart)
        {
            var currentCustomers = await _context.Customers.CountAsync(c => c.CreatedAt >= currentMonthStart);
            var lastCustomers = await _context.Customers.CountAsync(c => c.CreatedAt >= lastMonthStart && c.CreatedAt < currentMonthStart);

            return (currentCustomers, lastCustomers);
        }

        private async Task<List<DashboardRecentBookingDto>> GetRecentBookingsAsync()
        {
            return await _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.SalonService)
                .OrderByDescending(b => b.CreatedAt)
                .Take(5) 
                .Select(b => new DashboardRecentBookingDto
                {
                    Id = b.ID,
                    CustomerName = b.Customer.FirstName + " " + b.Customer.LastName,
                    ServiceName = b.SalonService.Service.Name,
                    CreatedAt = b.CreatedAt,
                    Status = b.Status.ToString()
                })
                .ToListAsync();
        }

        private double CalculatePercentage(decimal current, decimal previous)
        {
            if (previous == 0) return current > 0 ? 100 : 0;
            return (double)Math.Round(((current - previous) / previous) * 100, 2);
        }
    }
}