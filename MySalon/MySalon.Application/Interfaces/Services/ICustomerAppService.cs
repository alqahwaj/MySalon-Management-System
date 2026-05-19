using MySalon.Application.DTOs.Customers;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Services
{
    public interface ICustomerAppService
    {
        Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto dto, string? userId = null);

        Task<IEnumerable<CustomerDto>> GetAllCustomersAsync();

        Task<CustomerDto?> GetCustomerByIdAsync(Guid id);

        Task<CustomerDto?> GetCustomerByEmailAsync(string email);

        Task<CustomerDto> UpdateCustomerAsync(Guid id, CreateCustomerDto dto);

        Task DeleteCustomerAsync(Guid id);

        Task<CustomerDto?> GetCustomerByUserIdAsync(string userId);
    }
}