using System;

namespace MySalon.Application.DTOs.Customers
{
    public class CustomerDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string phone { get; set; } = string.Empty;

        public string ApplicationUserId { get; set; } = string.Empty;

    }
}