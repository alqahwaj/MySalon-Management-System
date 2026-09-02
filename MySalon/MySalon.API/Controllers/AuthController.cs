using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MySalon.Application.DTOs.Auth; 
using MySalon.Application.Interfaces.Services;


namespace MySalon.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger; 

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;

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
        [EnableRateLimiting("AuthLimiter")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var result = await _authService.LoginAsync(model);

            if (!result.IsAuthenticated)
            {
                _logger.LogWarning("SECURITY ALERT: Failed login attempt for email: {Email}. Reason: {Message}", model.Email, result.Message);
                return BadRequest(result.Message);
            }

            _logger.LogInformation("User {Email} logged in successfully.", model.Email);
            return Ok(result);
        }

        [HttpPost("refresh")]
        [EnableRateLimiting("AuthLimiter")] 
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.RefreshTokenAsync(model);

            if (!result.IsAuthenticated)
                return BadRequest(new { Message = result.Message });

            return Ok(result);
        }
    }
}