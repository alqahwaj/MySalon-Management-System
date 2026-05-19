using Microsoft.EntityFrameworkCore;
using MySalon.Application.Interfaces.Repositories;
using MySalon.Domain.Entities;
using MySalon.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MySalon.Infrastructure.Repositories
{
    public class SalonServiceRepository : ISalonServiceRepository
    {
        private readonly MySalonDbContext _context;

        public SalonServiceRepository(MySalonDbContext context)
        {
            _context = context;
        }
        public async Task<SalonService> AddAsync(SalonService salonService)
        {
            await _context.AddAsync(salonService);

            await _context.SaveChangesAsync();

            return salonService;
        }

        public async Task<IEnumerable<SalonService>> GetBySalonIdAsync(Guid salonId)
        {
            return await _context.SalonServices
                .Include(s => s.Service) 
                .Where(s => s.SalonId == salonId) 
                .ToListAsync();
        }

        public async Task<SalonService?> GetByIdAsync(Guid id)
        {
            return await _context.SalonServices
                .Include(s => s.Service) 
                .FirstOrDefaultAsync(s => s.ID == id);
        }

        public async Task UpdateAsync(SalonService salonService)
        {
            _context.Update(salonService);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(SalonService salonService)
        {
            _context.SalonServices.Remove(salonService);
            await _context.SaveChangesAsync();
        }
    }
}
