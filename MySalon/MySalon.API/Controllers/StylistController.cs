using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySalon.Application.DTOs.Stylists;
using MySalon.Application.Interfaces.Services;

namespace MySalon.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StylistController : ControllerBase
    {
        private readonly IStylistAppService _stylistAppService;

        public StylistController(IStylistAppService stylistAppService)
        {
            _stylistAppService = stylistAppService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin, SalonOwner")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<ActionResult<StylistDto>> Create(CreateStylistDto dto)
        {
            var result = await _stylistAppService.CreateStylistAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StylistDto>>> GetAll()
        {
            var result = await _stylistAppService.GetAllStylistsAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StylistDto>> GetById(Guid id)
        {
            var stylist = await _stylistAppService.GetStylistByIdAsync(id);
            if (stylist == null) return NotFound($"Stylist with ID {id} not found.");
            return Ok(stylist);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, SalonOwner")]
        public async Task<ActionResult<StylistDto>> Update(Guid id, [FromBody] UpdateStylistDto dto)
        {
            var updatedStylist = await _stylistAppService.UpdateStylistAsync(id, dto);
            return Ok(updatedStylist);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, SalonOwner")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _stylistAppService.DeleteStylistAsync(id);
            return NoContent();
        }
    }
}