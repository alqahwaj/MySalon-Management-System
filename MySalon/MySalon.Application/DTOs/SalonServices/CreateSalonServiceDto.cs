using System;
using System.ComponentModel.DataAnnotations;

namespace MySalon.Application.DTOs.SalonServices
{
    public class CreateSalonServiceDto
    {
        [Required(ErrorMessage = "SalonId is required")]
        public Guid SalonId { get; set; }

        [Required(ErrorMessage = "ServiceId is required")]
        public Guid ServiceId { get; set; }

        [Required(ErrorMessage = "Price is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be greater than 0")] 
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Duration is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Duration must be at least 1 minute")] 
        public int DurationMinutes { get; set; }

        public bool IsAvailable { get; set; } = true;
    }
}