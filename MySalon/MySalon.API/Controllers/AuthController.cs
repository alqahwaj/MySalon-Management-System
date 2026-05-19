using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySalon.Application.DTOs.Auth; 
using MySalon.Application.Interfaces.Services;


namespace MySalon.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        
        [HttpPost("register-customer")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterCustomer([FromBody] RegisterCustomerDto dto)
        {
            var serviceDto = new RegisterDto
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                Password = dto.Password,

                Role = "Customer",
                SalonId = null 
            };

            var result = await _authService.RegisterAsync(serviceDto);

            if (!result.IsAuthenticated)
                return BadRequest(result.Message);

            return Ok(result);
        }

        [HttpPost("create-staff")]
        [Authorize(Roles = "Admin, SalonOwner")]
        public async Task<IActionResult> CreateStaff([FromBody] CreateStaffDto dto)
        {
            var serviceDto = new RegisterDto
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                Password = dto.Password,

                Role = dto.Role,
                SalonId = dto.SalonId
            };

            var result = await _authService.RegisterAsync(serviceDto);

            if (!result.IsAuthenticated)
                return BadRequest(result.Message);

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var result = await _authService.LoginAsync(model);

            if (!result.IsAuthenticated)
                return BadRequest(result.Message);

            return Ok(result);
        }
    }
}