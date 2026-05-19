using MySalon.Domain.Entities;
using System.Threading.Tasks;
using System; 
using System.Collections.Generic; 

namespace MySalon.Application.Interfaces.Repositories
{
    public interface ISalonServiceRepository
    {
        Task<SalonService> AddAsync(SalonService salonService);

        Task<SalonService?> GetByIdAsync(Guid Id);

        Task<IEnumerable<SalonService>> GetBySalonIdAsync(Guid salonId);


        Task UpdateAsync(SalonService salonService);

        Task DeleteAsync(SalonService salonService);
    }
}
