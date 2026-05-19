using MySalon.Application.DTOs.Customers;
using MySalon.Application.DTOs.Stylists;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Services
{
    public interface IStylistAppService
    {
        Task<StylistDto> CreateStylistAsync(CreateStylistDto dto);

        Task<StylistDto?> GetStylistByIdAsync(Guid id);

        Task<StylistDto?> GetStylistByEmailAsync(string email);

        Task<IEnumerable<StylistDto>> GetAllStylistsAsync();

        Task<StylistDto> UpdateStylistAsync(Guid id, CreateStylistDto dto);

        Task DeleteStylistAsync(Guid id);

        Task<StylistDto?> GetStylistByUserIdAsync(string userId);
    }
}