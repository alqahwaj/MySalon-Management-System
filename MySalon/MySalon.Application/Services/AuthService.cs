using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MySalon.Application.DTOs.Auth;
using MySalon.Application.Interfaces.Repositories;
using MySalon.Application.Interfaces.Services;
using MySalon.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MySalon.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IStylistRepository _stylistRepo;
        private readonly ICustomerRepository _customerRepo;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            IStylistRepository stylistRepo,
            ICustomerRepository customerRepo)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _stylistRepo = stylistRepo;
            _customerRepo = customerRepo;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return new AuthResponseDto { Message = "Email already registered.", IsAuthenticated = false };

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNumber = dto.Phone
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return new AuthResponseDto { Message = errors, IsAuthenticated = false };
            }

            if (!await _roleManager.RoleExistsAsync(dto.Role))
                await _roleManager.CreateAsync(new IdentityRole(dto.Role));

            await _userManager.AddToRoleAsync(user, dto.Role);

            if (dto.Role == "Stylist")
            {
                if (dto.SalonId == null)
                    return new AuthResponseDto { Message = "SalonId is required for Stylists.", IsAuthenticated = false };

                var stylist = new Stylist
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    SalonId = dto.SalonId.Value,
                    ApplicationUserId = user.Id,
                    IsActive = true
                };
                await _stylistRepo.AddAsync(stylist);
            }
            else if (dto.Role == "Customer")
            {
                var customer = new Customer
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    ApplicationUserId = user.Id,
                    IsActive = true
                };
                await _customerRepo.AddAsync(customer);
            }

            return await GenerateJwtToken(user);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                return new AuthResponseDto { Message = "Invalid email or password.", IsAuthenticated = false };
            }

            return await GenerateJwtToken(user);
        }

        private async Task<AuthResponseDto> GenerateJwtToken(ApplicationUser user)
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName ?? user.Email ?? "Unknown"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim("uid", user.Id)
            };

            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var keyString = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Secret Key is missing in configuration.");
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));

            var tokenExpiry = DateTime.Now.AddDays(30);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: tokenExpiry,
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new AuthResponseDto
            {
                IsAuthenticated = true,
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Email = user.Email ?? string.Empty,
                UserId = user.Id,
                Role = userRoles.FirstOrDefault() ?? string.Empty,
                Message = "Success",
                ExpiresOn = tokenExpiry
            };
        }
    }
}