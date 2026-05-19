using MySalon.Application.DTOs.Dashboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Repositories
{
    public interface IDashboardRepository
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
    }
}
