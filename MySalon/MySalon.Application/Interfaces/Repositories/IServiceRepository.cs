using MySalon.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Repositories
{
    public interface IServiceRepository
    {
        Task<Service> AddAsync(Service service);

        Task<Service?> GetByIdAsync(Guid id);

        Task<IEnumerable<Service>> GetAllAsync();

        Task<Service?> GetByNameAsync(string name);

        Task UpdateAsync(Service service);

        Task DeleteAsync(Service service);

    }
}
    