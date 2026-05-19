using MySalon.Application.DTOs.Services;
using MySalon.Application.Exceptions;
using MySalon.Application.Interfaces.Repositories;
using MySalon.Application.Interfaces.Services;
using MySalon.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MySalon.Application.Services
{
    public class ServiceAppService : IServiceAppService
    {
        private readonly IServiceRepository _repository;

        public ServiceAppService(IServiceRepository repository)
        {
            _repository = repository;
        }

        public async Task<ServiceDto> CreateServiceAsync(CreateServiceDto dto)
        {
            var existingService = await _repository.GetByNameAsync(dto.Name);
            if (existingService != null)
                throw new Exception("This service already exists.");

            if (!dto.Category.HasValue)
                throw new Exception("Category is required.");

            var newService = new Service
            {
                Name = dto.Name,
                Description = dto.Description,
                Category = dto.Category.Value, 
                ImageUrl = dto.ImageUrl
            };

            var savedService = await _repository.AddAsync(newService);
            return MapToDto(savedService);
        }

        public async Task<IEnumerable<ServiceDto>> GetAllServicesAsync()
        {
            var services = await _repository.GetAllAsync();
            return services.Select(s => MapToDto(s)).ToList();
        }

        public async Task<ServiceDto?> GetServiceByIdAsync(Guid id)
        {
            var service = await _repository.GetByIdAsync(id);
            return (service == null) ? null : MapToDto(service);
        }

        public async Task<ServiceDto> UpdateServiceAsync(Guid id, CreateServiceDto dto)
        {
            var service = await _repository.GetByIdAsync(id);

            if (service == null)
                throw new NotFoundException(nameof(Service), id);

            service.Name = dto.Name;
            service.Description = dto.Description;

            if (dto.Category.HasValue)
            {
                service.Category = dto.Category.Value;
            }

            if (!string.IsNullOrEmpty(dto.ImageUrl))
            {
                service.ImageUrl = dto.ImageUrl;
            }

            await _repository.UpdateAsync(service);

            return MapToDto(service);
        }

        public async Task DeleteServiceAsync(Guid id)
        {
            var service = await _repository.GetByIdAsync(id);

            if (service == null)
                throw new NotFoundException(nameof(Service), id);

            await _repository.DeleteAsync(service);
        }

        private static ServiceDto MapToDto(Service service)
        {
            return new ServiceDto
            {
                Id = service.ID,
                Name = service.Name,
                Description = service.Description,
                Category = service.Category.ToString(),
                ImageUrl = service.ImageUrl
            };
        }
    }
}