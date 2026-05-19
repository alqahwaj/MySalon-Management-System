using MySalon.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MySalon.Domain.Entities
{
    [Table("Services")]
    public class Service : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(255)]
        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public ServiceCategory Category { get; set; }

        public string? ImageUrl { get; set; }

        public virtual ICollection<SalonService> SalonServices { get; set; }

        public Service()
        {
            SalonServices = new HashSet<SalonService>();
        }
    }
}