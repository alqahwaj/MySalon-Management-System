using System;
using System.ComponentModel.DataAnnotations;

namespace MySalon.Application.DTOs.Stylists
{
    public class CreateStylistDto
    {
        [Required(ErrorMessage = "First Name is required")]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last Name is required")]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Salon is required")]
        public Guid SalonId { get; set; }


        [MaxLength(20)]
        [Phone]
        [Required(ErrorMessage = "Phone is required")]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(100)]
        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = string.Empty;

        public string? Bio { get; set; }

        public string? ImageUrl { get; set; }
    }
}