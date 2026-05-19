using Microsoft.AspNetCore.Authorization; // 👈 ضروري عشان الحماية
using Microsoft.AspNetCore.Mvc;
using MySalon.Application.DTOs.Salons;
using MySalon.Application.Interfaces.Services;

namespace MySalon.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalonsController : ControllerBase
    {
        private readonly ISalonAppService _salonAppService;

        public SalonsController(ISalonAppService salonAppService)
        {
            _salonAppService = salonAppService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<SalonDto>>> GetAll()
        {
            var result = await _salonAppService.GetAllSalonsAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<SalonDto>> GetById(Guid id)
        {
            var salon = await _salonAppService.GetSalonByIdAsync(id);

            if (salon == null)
                return NotFound($"Salon with ID {id} not found.");

            return Ok(salon);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SalonDto>> Create(CreateSalonDto dto)
        {
            var result = await _salonAppService.CreateSalonAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, SalonOwner")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<SalonDto>> Update(Guid id, [FromBody] UpdateSalonDto dto)
        {
            var updateSalon = await _salonAppService.UpdateSalonAsync(id, dto);
            return Ok(updateSalon);
        }

        //[HttpDelete("{id}")]
        //[Authorize(Roles = "Admin")]
        //[ProducesResponseType(StatusCodes.Status204NoContent)]
        //[ProducesResponseType(StatusCodes.Status404NotFound)]
        //public async Task<IActionResult> Delete(Guid id)
        //{
        //    // تأكد إن دالة DeleteSalonAsync موجودة في السيرفس عندك
        //    await _salonAppService.DeleteSalonAsync(id);
        //    return NoContent();
        //}
    }
}