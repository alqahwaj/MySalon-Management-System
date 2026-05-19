using Microsoft.EntityFrameworkCore;
using MySalon.Application.Interfaces.Repositories; 
using MySalon.Domain.Entities;
using MySalon.Infrastructure.Data;
using MySalon.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MySalon.Infrastructure.Repositories
{
    public class SalonRepository : ISalonRepository
    {
        private readonly MySalonDbContext _context;

        public SalonRepository(MySalonDbContext context)
        {
            _context = context;
        }

        public async Task<Salon> AddAsync(Salon salon)
        {
            await _context.Salons.AddAsync(salon);

            await _context.SaveChangesAsync();

            return salon;
        }

        public async Task<IEnumerable<Salon>> GetAllAsync()
        {
            return await _context.Salons.AsNoTracking().ToListAsync();
        }

        public async Task<Salon?> GetByEmailAsync(string email)
        {
            return await _context.Salons.GetByEmailCustomAsync(email);
        }

        public async Task<Salon?> GetByIdAsync(Guid id)
        {
            return await _context.Salons.FindAsync(id);
        }

        public async Task UpdateAsync(Salon salon)
        {
            _context.Update(salon);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Salon salon)
        {
            _context.Salons.Remove(salon);
            await _context.SaveChangesAsync();
        }

    }
}