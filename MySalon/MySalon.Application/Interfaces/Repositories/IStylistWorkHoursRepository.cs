using MySalon.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Repositories
{
    public interface IStylistWorkHoursRepository
    {
        Task<StylistWorkHours> AddAsync(StylistWorkHours stylistWorkHours);

        Task<IEnumerable<StylistWorkHours>> GetByStylistIdAsync(Guid stylistId);
        Task<StylistWorkHours?> GetByIdAsync(Guid id);
    }
}
