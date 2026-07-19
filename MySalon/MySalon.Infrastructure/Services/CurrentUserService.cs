using Microsoft.AspNetCore.Http;
using MySalon.Application.Exceptions;
using MySalon.Application.Interfaces.Services;
using System.Security.Claims;

namespace MySalon.Infrastructure.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? GetUserId()
        {
            return _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        public bool IsAdmin()
        {
            return _httpContextAccessor.HttpContext?.User?.IsInRole("Admin") ?? false;
        }

        public void EnsureOwnershipOrIsAdmin(string? resourceUserId)
        {
            var currentUserId = GetUserId();
            var isAdmin = IsAdmin();

            if (isAdmin)
                return;

            if (currentUserId != resourceUserId)
            {
                throw new ForbiddenAccessException(); 
            }
        }
    }
}