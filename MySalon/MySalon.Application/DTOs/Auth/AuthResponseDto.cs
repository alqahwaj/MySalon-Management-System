namespace MySalon.Application.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Message { get; set; } = string.Empty;
        public bool IsAuthenticated { get; set; }
        public string Token { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string UserId { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;

        public DateTime? ExpiresOn { get; set; }

        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiration { get; set; }
    }
}