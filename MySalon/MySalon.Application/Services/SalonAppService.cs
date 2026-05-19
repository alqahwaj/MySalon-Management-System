using MySalon.Application.DTOs.Salons;
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
    public class SalonAppService : ISalonAppService
    {
        private readonly ISalonRepository _repository;

        public SalonAppService(ISalonRepository repository)
        {
            _repository = repository;
        }

        public async Task<SalonDto> CreateSalonAsync(CreateSalonDto dto)
        {
            var existingSalon = await _repository.GetByEmailAsync(dto.Email);
            if (existingSalon != null)
                throw new Exception("This email is already registered.");

            var newSalon = new Salon
            {
                Name = dto.Name,
                PhoneNumber = dto.PhoneNumber,
                Address = dto.Address,
                Email = dto.Email
            };
            var savedSalon = await _repository.AddAsync(newSalon);
            return MapToDto(savedSalon);
        }

        public async Task<IEnumerable<SalonDto>> GetAllSalonsAsync()
        {
            var salons = await _repository.GetAllAsync();
            return salons.Select(s => MapToDto(s)).ToList();
        }

        public async Task<SalonDto?> GetSalonByIdAsync(Guid id)
        {
            var salon = await _repository.GetByIdAsync(id);
            return (salon == null) ? null : MapToDto(salon);
        }

        public async Task<SalonDto?> GetSalonByEmailAsync(string email)
        {
            var salon = await _repository.GetByEmailAsync(email);

            if (salon == null)
                return null;
            return MapToDto(salon);
        }

        public async Task<SalonDto> UpdateSalonAsync(Guid id, UpdateSalonDto dto)
        {
            var salon = await _repository.GetByIdAsync(id);

            if (salon == null)
                throw new NotFoundException(nameof(Salon), id);

            if (dto.Email != salon.Email)
            {
                var existingUserWithEmail = await _repository.GetByEmailAsync(dto.Email);

                if (existingUserWithEmail != null && existingUserWithEmail.ID != id)
                {
                    throw new Exception("This email is already taken by another user.");
                }
            }

            salon.Name = dto.Name;
            salon.Address = dto.Address;
            salon.PhoneNumber = dto.PhoneNumber;
            salon.Email = dto.Email;
            salon.Description = dto.Description;

            if (!string.IsNullOrEmpty(dto.LogoUrl))
            {
                salon.LogoUrl = dto.LogoUrl;
            }

            if (!string.IsNullOrEmpty(dto.CoverImageUrl))
            {
                salon.CoverImageUrl = dto.CoverImageUrl;
            }

            await _repository.UpdateAsync(salon);

            return MapToDto(salon);
        }

        private static SalonDto MapToDto(Salon salon)
        {
            return new SalonDto
            {
                Id = salon.ID,
                Name = salon.Name,
                Email = salon.Email,
                Phone = salon.PhoneNumber ?? string.Empty,
                Address = salon.Address
            };
        }
    }
}