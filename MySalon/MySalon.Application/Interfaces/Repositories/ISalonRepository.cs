using System;
using MySalon.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Repositories
{
    public interface ISalonRepository
    {
        Task<Salon> AddAsync(Salon salon);

        Task<Salon?> GetByIdAsync(Guid id);

        Task<IEnumerable<Salon>> GetAllAsync();

        Task<Salon?> GetByEmailAsync(string email);

        Task UpdateAsync(Salon salon);

        Task DeleteAsync(Salon salon);

    }
}
