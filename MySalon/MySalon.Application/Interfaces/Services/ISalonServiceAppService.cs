using MySalon.Application.DTOs.SalonServices;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Services
{
    public interface ISalonServiceAppService
    {
        Task<SalonServiceDto> CreateSalonServiceAsync(CreateSalonServiceDto dto);

        Task<IEnumerable<SalonServiceDto>> GetSalonServicesBySalonIdAsync(Guid salonId);

        Task<SalonServiceDto?> GetSalonServiceByIdAsync(Guid id);

        Task<SalonServiceDto> UpdateSalonServiceAsync(Guid id, CreateSalonServiceDto dto);

        Task DeleteSalonService(Guid id);
    }
}