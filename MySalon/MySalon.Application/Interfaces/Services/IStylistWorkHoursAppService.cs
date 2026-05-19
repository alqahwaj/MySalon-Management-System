using MySalon.Application.DTOs.StylistWorkHours;
using MySalon.Application.DTOs.WorkHours;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Services
{
    public interface IStylistWorkHourAppService
    {
        Task<StylistWorkHourDto> CreateWorkHourAsync(CreateStylistWorkHoursDto dto);

        Task<IEnumerable<StylistWorkHourDto>> GetWorkHoursByStylistIdAsync(Guid stylistId);

        Task<StylistWorkHourDto?> GetWorkHourByIdAsync(Guid id);
    }
}