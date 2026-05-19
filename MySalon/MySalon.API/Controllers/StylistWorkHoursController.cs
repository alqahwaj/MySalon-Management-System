using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySalon.Application.DTOs.StylistWorkHours;
using MySalon.Application.DTOs.WorkHours;
using MySalon.Application.Interfaces.Services;
using System.Security.Claims;

namespace MySalon.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StylistWorkHoursController : ControllerBase
    {
        private readonly IStylistWorkHourAppService _stylistWorkHoursAppService;
        private readonly IStylistAppService _stylistAppService; 

        public StylistWorkHoursController(IStylistWorkHourAppService stylistWorkHoursAppService, IStylistAppService stylistAppService)
        {
            _stylistWorkHoursAppService = stylistWorkHoursAppService;
            _stylistAppService = stylistAppService;
        }

       
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<StylistWorkHourDto>> Create(CreateStylistWorkHoursDto dto)
        {
            var result = await _stylistWorkHoursAppService.CreateWorkHourAsync(dto);

            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<StylistWorkHourDto>> GetById(Guid id)
        {
            var stylistWorkHours = await _stylistWorkHoursAppService.GetWorkHourByIdAsync(id);

            if (stylistWorkHours == null)
                return NotFound($"WorkHour with ID {id} not found.");

            return Ok(stylistWorkHours);
        }

        [HttpGet("stylist/{stylistId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<StylistWorkHourDto>>> GetByStylistId(Guid stylistId)
        {
            var result = await _stylistWorkHoursAppService.GetWorkHoursByStylistIdAsync(stylistId);

            return Ok(result);
        }

        [HttpGet("my-work-hours")]
        [Authorize(Roles = "Stylist")]
        public async Task<IActionResult> GetMyWorkHours()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var stylist = await _stylistAppService.GetStylistByUserIdAsync(userId);
            if (stylist == null) return NotFound("Stylist profile not found.");

            var workHours = await _stylistWorkHoursAppService.GetWorkHoursByStylistIdAsync(stylist.Id);

            return Ok(workHours);
        }
    }
}