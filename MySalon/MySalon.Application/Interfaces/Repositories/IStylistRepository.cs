using MySalon.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Repositories
{
    public interface IStylistRepository
    {
        Task<Stylist> AddAsync(Stylist stylist);
        Task<Stylist?> GetByIdAsync(Guid id);
        Task<IEnumerable<Stylist>> GetAllAsync();

        Task<Stylist?> GetByEmailAsync(string email);

        Task UpdateAsync(Stylist stylist);
        Task DeleteAsync(Stylist stylist);

        Task<Stylist?> GetByUserIdAsync(string userId);


    }
}
