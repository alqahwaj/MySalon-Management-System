using MySalon.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Repositories
{
    public interface ICustomerRepository
    {
        Task<Customer> AddAsync(Customer customer);
        Task<Customer?> GetByIdAsync(Guid id);
        Task<Customer?> GetByUserIdAsync(string userId);
        Task<IEnumerable<Customer>> GetAllAsync();
        Task UpdateAsync(Customer customer);

        public Task<Customer?> GetByEmailAsync(string email);

        Task DeleteAsync(Customer customer);
    }

}
