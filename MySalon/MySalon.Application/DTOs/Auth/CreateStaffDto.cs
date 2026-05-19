using System.ComponentModel.DataAnnotations;

namespace MySalon.Application.DTOs.Auth
{
    public class CreateStaffDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public string Phone { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty;

        public Guid? SalonId { get; set; }
    }
}