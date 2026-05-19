using MySalon.Application.DTOs.SalonServices;
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
    public class SalonServiceAppService : ISalonServiceAppService
    {
        private readonly ISalonServiceRepository _repository;
        private readonly IServiceRepository _serviceRepository;

        public SalonServiceAppService(ISalonServiceRepository repository, IServiceRepository serviceRepository)
        {
            _repository = repository;
            _serviceRepository = serviceRepository;
        }

        public async Task<SalonServiceDto> CreateSalonServiceAsync(CreateSalonServiceDto dto)
        {
            var serviceExists = await _serviceRepository.GetByIdAsync(dto.ServiceId);
            if (serviceExists == null)
            {
                throw new Exception("Selected service does not exist.");
            }

            var newSalonService = new SalonService
            {
                SalonId = dto.SalonId,
                ServiceId = dto.ServiceId,
                Price = dto.Price,
                DurationMinutes = dto.DurationMinutes,
                IsAvailable = dto.IsAvailable
            };

            var savedEntity = await _repository.AddAsync(newSalonService);

            savedEntity.Service = serviceExists;

            return MapToDto(savedEntity);
        }

        public async Task<IEnumerable<SalonServiceDto>> GetSalonServicesBySalonIdAsync(Guid salonId)
        {
            var salonServices = await _repository.GetBySalonIdAsync(salonId);

            return salonServices.Select(s => MapToDto(s)).ToList();
        }

        public async Task<SalonServiceDto?> GetSalonServiceByIdAsync(Guid id)
        {
            var salonService = await _repository.GetByIdAsync(id);
            return (salonService == null) ? null : MapToDto(salonService);
        }

        private static SalonServiceDto MapToDto(SalonService salonService)
        {
            return new SalonServiceDto
            {
                Id = salonService.ID,
                SalonId = salonService.SalonId,
                ServiceId = salonService.ServiceId,
                ServiceName = salonService.Service?.Name ?? "Unknown Service",
                Price = salonService.Price,
                DurationMinutes = salonService.DurationMinutes,
                IsAvailable = salonService.IsAvailable,
                ImageUrl = salonService.Service?.ImageUrl
            };
        }

        public async Task<SalonServiceDto> UpdateSalonServiceAsync(Guid id, CreateSalonServiceDto dto)
        {
            var salonservice = await _repository.GetByIdAsync(id);

            if (salonservice == null)
                throw new NotFoundException(nameof(SalonService), id);

            salonservice.Price = dto.Price;
            salonservice.DurationMinutes = dto.DurationMinutes;
            salonservice.IsAvailable = dto.IsAvailable;

            await _repository.UpdateAsync(salonservice);

            return MapToDto(salonservice);
        }

        public async Task DeleteSalonService(Guid id)
        {
            var salonservice = await _repository.GetByIdAsync(id);

            if (salonservice == null)
                throw new NotFoundException(nameof(SalonService), id);

            await _repository.DeleteAsync(salonservice);
        }
    }
}