using MySalon.Domain.Enums;
using System;

namespace MySalon.Application.DTOs.Bookings
{
    public class BookingDto
    {
        public Guid Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string StylistName { get; set; } = string.Empty;
        public string ServiceName { get; set; } = string.Empty;
        public string SalonName { get; set; } = string.Empty;

        public Guid CustomerId { get; set; }
        public Guid SalonId { get; set; }
        public Guid SalonServiceId { get; set; }
        public Guid StylistId { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public string? Note { get; set; }
    }
}