using MySalon.Application.DTOs.Dashboard;
using MySalon.Application.Interfaces.Repositories;
using MySalon.Application.Interfaces.Services;
using System.Threading.Tasks;

namespace MySalon.Application.Services
{
    public class DashboardAppService : IDashboardAppService
    {
        private readonly IDashboardRepository _dashboardRepository;

        public DashboardAppService(IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            return await _dashboardRepository.GetDashboardStatsAsync();
        }
    }
}
