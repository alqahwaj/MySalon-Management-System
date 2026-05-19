using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Application.DTOs.Customers
{
    public class CreateCustomerDto
    {
        [Required(ErrorMessage = "First Name is required")]
        [MaxLength(50, ErrorMessage = "First Name cannot be longer than 50 characters")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last Name is required")]
        [MaxLength(50, ErrorMessage = "Last Name cannot be longer than 50 characters")]
        public string LastName { get; set; } = string.Empty;


        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = string.Empty;

        [MaxLength(20)]
        [Phone(ErrorMessage = "Invalid Phone Number")]
        [Required(ErrorMessage = "Phone is required")]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(100)]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public string ApplicationUserId { get; set; } = string.Empty;


    }
}
