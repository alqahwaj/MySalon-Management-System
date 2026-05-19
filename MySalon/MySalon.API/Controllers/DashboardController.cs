using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySalon.Application.DTOs.Dashboard;
using MySalon.Application.Interfaces.Services;
using System.Threading.Tasks;

namespace MySalon.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardAppService _dashboardAppService;

        public DashboardController(IDashboardAppService dashboardAppService)
        {
            _dashboardAppService = dashboardAppService;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<DashboardStatsDto>> GetStats()
        {
            var stats = await _dashboardAppService.GetDashboardStatsAsync();
            return Ok(stats);
        }
    }
}
