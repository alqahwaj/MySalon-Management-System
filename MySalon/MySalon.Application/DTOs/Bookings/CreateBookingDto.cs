using System;
using System.ComponentModel.DataAnnotations;

namespace MySalon.Application.DTOs.Bookings
{
    public class CreateBookingDto
    {
        
        public Guid? CustomerId { get; set; }

        [Required(ErrorMessage = "Salon is required")]
        public Guid SalonId { get; set; }

        [Required(ErrorMessage = "Service is required")]
        public Guid SalonServiceId { get; set; }

        [Required(ErrorMessage = "Stylist is required")]
        public Guid StylistId { get; set; }

        [Required(ErrorMessage = "Start Time is required")]
        public DateTime StartTime { get; set; }

        public string? Note { get; set; }
    }
}