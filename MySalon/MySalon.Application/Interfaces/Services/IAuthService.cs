using MySalon.Application.DTOs.Auth;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);

        Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenDto model);
    }
}