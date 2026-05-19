using Microsoft.EntityFrameworkCore;
using MySalon.Application.Interfaces.Repositories;
using MySalon.Domain.Entities;
using MySalon.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Infrastructure.Repositories
{
    public class StylistWorkHoursRepository : IStylistWorkHoursRepository
    {
        private readonly MySalonDbContext _context;

        public StylistWorkHoursRepository(MySalonDbContext context)
        {
            _context = context;
        }

        public async Task<StylistWorkHours> AddAsync(StylistWorkHours stylistWorkHours)
        {
            await _context.AddAsync(stylistWorkHours);
            await _context.SaveChangesAsync();

            return stylistWorkHours;
        }

        public async Task<StylistWorkHours?> GetByIdAsync(Guid id)
        {
            return await _context.StylistWorkHours.FindAsync(id);
        }

        public async Task<IEnumerable<StylistWorkHours>> GetByStylistIdAsync(Guid stylistId)
        {
            return await _context.StylistWorkHours.
                Where(x => x.StylistId == stylistId)
                .AsNoTracking().ToListAsync();
        }
    }
}
