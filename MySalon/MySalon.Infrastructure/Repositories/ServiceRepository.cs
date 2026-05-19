using Microsoft.EntityFrameworkCore;
using MySalon.Application.Interfaces.Repositories;
using MySalon.Domain.Entities;
using MySalon.Infrastructure.Data;


namespace MySalon.Infrastructure.Repositories
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly MySalonDbContext _context;

        public ServiceRepository(MySalonDbContext context)
        {
            _context = context;
        }
        public async Task<Service> AddAsync(Service service)
        {
            await _context.Services.AddAsync(service);

            await _context.SaveChangesAsync();

            return service;
        }

        public async Task<IEnumerable<Service>> GetAllAsync()
        {
            return await _context.Services.AsNoTracking().ToListAsync();
        }

        public async Task<Service?> GetByIdAsync(Guid id)
        {
            return await _context.Services.FindAsync(id);
        }

        public async Task<Service?> GetByNameAsync(string name)
        {
            return await _context.Services.FirstOrDefaultAsync(s => s.Name.ToLower() == name.ToLower());
        }

        public async Task UpdateAsync(Service service)
        {
            _context.Services.Update(service);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(Service service)
        {
            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
        }
    }
}
