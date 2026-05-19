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
    public class StylistRepository : IStylistRepository
    {
        private readonly MySalonDbContext _context;

        public StylistRepository(MySalonDbContext context)
        {
            _context = context;
        }
        public async Task<Stylist> AddAsync(Stylist stylist)
        {
            await _context.AddAsync(stylist);
            await _context.SaveChangesAsync();

            return stylist;
        }

        public async Task<IEnumerable<Stylist>> GetAllAsync()
        {
            return await _context.Stylists.AsNoTracking().ToListAsync();
        }

        public async Task<Stylist?> GetByEmailAsync(string email)
        {
            return await _context.Stylists.GetByEmailCustomAsync(email);
        }

        public async Task<Stylist?> GetByIdAsync(Guid id)
        {
            return await _context.Stylists.FindAsync(id);
        }

        public async Task UpdateAsync(Stylist stylist)
        {
            _context.Update(stylist);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Stylist stylist)
        {
            _context.Stylists.Remove(stylist);
            await _context.SaveChangesAsync();
        }

        public async Task<Stylist?> GetByUserIdAsync(string userId)
        {
            return await _context.Stylists
                .FirstOrDefaultAsync(s => s.ApplicationUserId == userId);
        }

    }
}
