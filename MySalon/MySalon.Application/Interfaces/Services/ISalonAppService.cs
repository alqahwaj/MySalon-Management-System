using MySalon.Application.DTOs.Customers;
using MySalon.Application.DTOs.Salons;
using MySalon.Application.DTOs.Stylists;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Services
{
    public interface ISalonAppService
    {
        Task<SalonDto> CreateSalonAsync(CreateSalonDto dto);

        Task<IEnumerable<SalonDto>> GetAllSalonsAsync();

        Task<SalonDto?> GetSalonByIdAsync(Guid id);

        Task<SalonDto?> GetSalonByEmailAsync(string email);

        Task<SalonDto> UpdateSalonAsync(Guid id, UpdateSalonDto dto);



    }
}