using MySalon.Domain.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MySalon.Domain.Entities
{
    public abstract class UserBase : BaseEntity, IHasEmail
    {
        [MaxLength(50)]
        [Required]
        public string FirstName { get; set; } = String.Empty;

        [MaxLength(50)]
        [Required]
        public string LastName { get; set; } = String.Empty;

        [NotMapped]
        public string FullName => $"{FirstName} {LastName}";


        [MaxLength(20)]
        [Phone]
        [Required]
        public string Phone { get; set; } = String.Empty;

        [MaxLength(100)]
        [EmailAddress]
        [Required]
        public string Email { get; set; } = String.Empty;

        public string? ImageUrl { get; set; }

        public bool IsActive { get; set; } = true;

        public string? ApplicationUserId { get; set; }

        [ForeignKey(nameof(ApplicationUserId))]
        public ApplicationUser? ApplicationUser { get; set; }
    }
}