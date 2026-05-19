using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Domain.Entities
{
    [Table("Customers")]
    public class Customer : UserBase
    {
        [Required]
        public int LoyaltyPoints { get; set; } = 0;

        public virtual ICollection<Booking> Bookings { get; set; }

        public Customer()
        {
            Bookings = new HashSet<Booking>();
        }
    }
}
