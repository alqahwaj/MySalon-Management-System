using Microsoft.AspNetCore.Authorization; // 👈 لا تنسى هاي
using Microsoft.AspNetCore.Mvc;
using MySalon.Application.DTOs.SalonServices;
using MySalon.Application.Interfaces.Services;

namespace MySalon.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalonServicesController : ControllerBase
    {
        private readonly ISalonServiceAppService _salonServiceAppService;

        public SalonServicesController(ISalonServiceAppService salonServiceAppService)
        {
            _salonServiceAppService = salonServiceAppService;
        }

        [HttpGet("salon/{salonId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<SalonServiceDto>>> GetBySalonId(Guid salonId)
        {
            var result = await _salonServiceAppService.GetSalonServicesBySalonIdAsync(salonId);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<SalonServiceDto>> GetById(Guid id)
        {
            var salonService = await _salonServiceAppService.GetSalonServiceByIdAsync(id);

            if (salonService == null)
                return NotFound($"Salon Service with ID {id} not found.");

            return Ok(salonService);
        }

        [HttpPost]
        [Authorize(Roles = "Admin, SalonOwner")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SalonServiceDto>> Create(CreateSalonServiceDto dto)
        {
            var result = await _salonServiceAppService.CreateSalonServiceAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, SalonOwner")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<SalonServiceDto>> Update(Guid id, [FromBody] CreateSalonServiceDto dto)
        {
            var updateSalonService = await _salonServiceAppService.UpdateSalonServiceAsync(id, dto);
            return Ok(updateSalonService);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, SalonOwner")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _salonServiceAppService.DeleteSalonService(id);
            return NoContent();
        }
    }
}