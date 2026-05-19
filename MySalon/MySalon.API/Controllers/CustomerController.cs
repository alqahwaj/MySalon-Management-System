using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySalon.Application.DTOs.Customers;
using MySalon.Application.Interfaces.Services;
using System.Security.Claims;

namespace MySalon.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerAppService _customerAppService;

        public CustomerController(ICustomerAppService customerAppService)
        {
            _customerAppService = customerAppService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin, Stylist")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<ActionResult<CustomerDto>> Create(CreateCustomerDto dto)
        {
            var result = await _customerAppService.CreateCustomerAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpGet]
        [Authorize(Roles = "Admin, Stylist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetAll()
        {
            var result = await _customerAppService.GetAllCustomersAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, Stylist, Customer")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CustomerDto>> GetById(Guid id)
        {
            if (!await IsUserAuthorizedForResource(id))
                return Forbid(); 

            var customer = await _customerAppService.GetCustomerByIdAsync(id);
            if (customer == null) return NotFound();

            return Ok(customer);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Customer")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<CustomerDto>> Update(Guid id, [FromBody] CreateCustomerDto dto)
        {
            if (!await IsUserAuthorizedForResource(id))
                return Forbid();

            var updatedCustomer = await _customerAppService.UpdateCustomerAsync(id, dto);
            return Ok(updatedCustomer);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, Customer")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete(Guid id)
        {
            if (!await IsUserAuthorizedForResource(id))
                return Forbid();

            await _customerAppService.DeleteCustomerAsync(id);
            return NoContent();
        }


        private async Task<bool> IsUserAuthorizedForResource(Guid customerId)
        {
            
            if (User.IsInRole("Admin") || User.IsInRole("Stylist"))
            {
                return true;
            }

            
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
                return false; 

            var customer = await _customerAppService.GetCustomerByIdAsync(customerId);

            if (customer == null)
                return false; 

            
            return customer.ApplicationUserId == currentUserId;
        }

    }
}   