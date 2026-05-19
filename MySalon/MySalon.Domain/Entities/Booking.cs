using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MySalon.Domain.Enums;

namespace MySalon.Domain.Entities
{
    [Table("Bookings")]
    public class Booking : BaseEntity
    {
        [ForeignKey("CustomerId")]
        public Guid CustomerId { get; set; } 

        public virtual Customer? Customer { get; set; } 

        [ForeignKey("SalonId")]
        public Guid SalonId { get; set; }

        public virtual Salon? Salon { get; set; }

        [ForeignKey("SalonServiceId")]
        public Guid SalonServiceId { get; set; }

        public virtual SalonService? SalonService { get; set; }

        [ForeignKey("StylistId")]
        public Guid StylistId { get; set; }

        public virtual Stylist? Stylist { get; set; }



        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }


        [Required]
        public BookingStatus Status { get; set; } = BookingStatus.Pending;

        public decimal TotalPrice { get; set; }

        public string? Note { get; set; }
    }
}