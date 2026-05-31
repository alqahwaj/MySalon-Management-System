using Microsoft.AspNetCore.Mvc;
using MySalon.Application.DTOs.Services;
using MySalon.Application.Exceptions;
using MySalon.Application.Interfaces.Services;
using MySalon.Application.Services;

namespace MySalon.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceAppService _ServiceAppService;

        public ServicesController(IServiceAppService serviceService)
        {
            _ServiceAppService = serviceService;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ServiceDto>> Create([FromForm] CreateServiceDto dto) 
        {
            var result = await _ServiceAppService.CreateServiceAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetAll()
        {
            var result = await _ServiceAppService.GetAllServicesAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ServiceDto>> GetById(Guid id)
        {
            var service = await _ServiceAppService.GetServiceByIdAsync(id);

            if (service == null)
                return NotFound($"Service with ID {id} not found.");

            return Ok(service);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(Guid id, [FromForm] CreateServiceDto dto) 
        {
            await _ServiceAppService.UpdateServiceAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _ServiceAppService.DeleteServiceAsync(id);
            return NoContent();
        }
    }
}