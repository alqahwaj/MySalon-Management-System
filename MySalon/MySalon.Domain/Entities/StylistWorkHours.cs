using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MySalon.Domain.Entities
{
    [Table("StylistWorkHours")]
    public class StylistWorkHours : BaseEntity
    {
        [ForeignKey("StylistId")]
        public Guid StylistId { get; set; }

        public virtual Stylist? Stylist { get; set; }

        [Required]
        public DayOfWeek DayOfWeek { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }
    }
}