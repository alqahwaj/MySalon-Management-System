using MySalon.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MySalon.Domain.Entities
{
    [Table("Salons")]
    public class Salon : BaseEntity, IHasEmail
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Address { get; set; } = string.Empty;

        [Phone]
        public string? PhoneNumber { get; set; }

        [MaxLength(100)]
        [EmailAddress]
        [Required]
        public string Email { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public string? LogoUrl { get; set; }
        public string? CoverImageUrl { get; set; }

        public virtual ICollection<SalonImage> Images { get; set; }
        public virtual ICollection<SalonService> SalonServices { get; set; }
        public virtual ICollection<Stylist> Stylists { get; set; }
        public virtual ICollection<Booking> Bookings { get; set; }

        public Salon()
        {
            Images = new HashSet<SalonImage>();
            SalonServices = new HashSet<SalonService>();
            Stylists = new HashSet<Stylist>();
            Bookings = new HashSet<Booking>();
        }
    }
}