using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MySalon.Domain.Entities
{
    [Table("Stylists")]
    public class Stylist : UserBase
    {
        [ForeignKey("SalonId")]
        public Guid SalonId { get; set; }

        public virtual Salon? Salon { get; set; }

        [Range(0, 5)]
        public double Rating { get; set; }

        public int RatingCount { get; set; }

        public string? Bio { get; set; }

        public virtual ICollection<StylistWorkHours> WorkHours { get; set; }

        public virtual ICollection<Booking> Bookings { get; set; }

        public Stylist()
        {
            WorkHours = new HashSet<StylistWorkHours>();
            Bookings = new HashSet<Booking>();
        }
    }
}