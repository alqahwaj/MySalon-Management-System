using MySalon.Application.DTOs.Dashboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Services
{
    public interface IDashboardAppService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
    }
}
