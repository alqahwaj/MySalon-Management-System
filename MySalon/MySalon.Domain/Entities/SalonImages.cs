using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MySalon.Domain.Entities
{
    [Table("SalonImages")]
    public class SalonImage : BaseEntity
    {
        [ForeignKey("SalonId")]
        public Guid SalonId { get; set; }

        public virtual Salon? Salon { get; set; }

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        public int DisplayOrder { get; set; }
    }
}