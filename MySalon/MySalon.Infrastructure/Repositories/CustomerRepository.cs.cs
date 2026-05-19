using Microsoft.EntityFrameworkCore;
using MySalon.Application.Interfaces.Repositories;
using MySalon.Domain.Entities;
using MySalon.Infrastructure.Data;
using MySalon.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Infrastructure.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly MySalonDbContext _context;

        public CustomerRepository(MySalonDbContext context)
        {
            _context = context;
        }

        public async Task<Customer> AddAsync(Customer customer)
        {
            await _context.AddAsync(customer);
            await _context.SaveChangesAsync();

            return customer;
        }

       

        public async Task<IEnumerable<Customer>> GetAllAsync()
        {
            return await _context.Customers.AsNoTracking().ToListAsync();
        }

        public async Task<Customer?> GetByEmailAsync(string email)
        {
            return await _context.Customers.GetByEmailCustomAsync(email);
        }

        public async Task<Customer?> GetByIdAsync(Guid id)
        {
            return await _context.Customers.FindAsync(id);
        }

        public async Task UpdateAsync(Customer customer)
        {
             _context.Update(customer);
            await _context.SaveChangesAsync();
        }
        
        public async Task DeleteAsync(Customer customer)
        {
            _context.Customers.Remove(customer); 
            await _context.SaveChangesAsync();
        }

        public async Task<Customer?> GetByUserIdAsync(string userId)
        {
            return await _context.Customers
                .FirstOrDefaultAsync(c => c.ApplicationUserId == userId);
        }

    }
}
