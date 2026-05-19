using MySalon.Application.DTOs.Services;
using MySalon.Domain.Entities;
using System; 
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Services
{
    public interface IServiceAppService
    {
        Task<ServiceDto> CreateServiceAsync(CreateServiceDto dto);

        Task<IEnumerable<ServiceDto>> GetAllServicesAsync();

        Task<ServiceDto?> GetServiceByIdAsync(Guid id);

        Task<ServiceDto> UpdateServiceAsync(Guid id, CreateServiceDto dto);

        Task DeleteServiceAsync(Guid id);
    }
}