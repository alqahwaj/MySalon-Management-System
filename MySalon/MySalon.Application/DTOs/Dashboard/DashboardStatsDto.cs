using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Application.DTOs.Dashboard
{

    public class DashboardRecentBookingDto
    {
        public Guid Id { get; set; }
        public string CustomerName { get; set; }
        public string ServiceName { get; set; }
        public DateTime CreatedAt { get; set; } 
        public string Status { get; set; }
    }
    public class DashboardStatsDto
    {
        public int TotalBookings { get; set; }
        public double BookingsPercentage { get; set; } 

        public decimal TotalRevenue { get; set; }
        public double RevenuePercentage { get; set; } 

        public int ActiveStylists { get; set; } 

        public int NewCustomers { get; set; }
        public double CustomersPercentage { get; set; }

        public List<DashboardRecentBookingDto> RecentBookings { get; set; } = new List<DashboardRecentBookingDto>();
    }
}
