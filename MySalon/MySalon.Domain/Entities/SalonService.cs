using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Domain.Entities
{
    [Table("SalonServices")]
    public class SalonService : BaseEntity
    {
        [ForeignKey("SalonId")]
        [Required]
        public Guid SalonId { get; set; }

        public virtual Salon? Salon { get; set; }

        [ForeignKey("ServiceId")]
        [Required]
        public Guid ServiceId { get; set; }

        public virtual Service? Service { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public int DurationMinutes { get; set; }

        public bool IsAvailable { get; set; } = true;


    }
}
