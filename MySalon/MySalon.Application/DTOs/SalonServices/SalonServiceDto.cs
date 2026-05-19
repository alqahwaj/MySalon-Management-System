using System;

namespace MySalon.Application.DTOs.SalonServices
{
    public class SalonServiceDto
    {
        public Guid Id { get; set; }

        public Guid SalonId { get; set; }
        public Guid ServiceId { get; set; } 
        public string ServiceName { get; set; }
        public decimal Price { get; set; }
        public int DurationMinutes { get; set; } 
        public bool IsAvailable { get; set; }

        public string? ImageUrl { get; set; }
    }
}