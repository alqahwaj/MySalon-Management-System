using MySalon.Application.DTOs.StylistWorkHours; 
using MySalon.Application.DTOs.WorkHours;
using MySalon.Application.Interfaces.Repositories;
using MySalon.Application.Interfaces.Services;
using MySalon.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MySalon.Application.Services
{
    public class StylistWorkHoursAppService : IStylistWorkHourAppService
    {
        private readonly IStylistWorkHoursRepository _repository;

        public StylistWorkHoursAppService(IStylistWorkHoursRepository repository)
        {
            _repository = repository;
        }

        public async Task<StylistWorkHourDto> CreateWorkHourAsync(CreateStylistWorkHoursDto dto)
        {
            if (dto.StartTime >= dto.EndTime)
                throw new Exception("Start Time cannot be greater than or equal to End Time.");

            var existingHours = await _repository.GetByStylistIdAsync(dto.StylistId);
            if (existingHours.Any(x => x.DayOfWeek == dto.DayOfWeek))
            {
                throw new Exception($"Stylist already has work hours defined for {dto.DayOfWeek}.");
            }

            var newWorkHour = new StylistWorkHours
            {
                StylistId = dto.StylistId,
                DayOfWeek = dto.DayOfWeek,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime
            };

            var savedEntity = await _repository.AddAsync(newWorkHour);

            return MapToDto(savedEntity);
        }

        public async Task<StylistWorkHourDto?> GetWorkHourByIdAsync(Guid id)
        {
            var workHour = await _repository.GetByIdAsync(id);
            return (workHour == null) ? null : MapToDto(workHour);
        }

        public async Task<IEnumerable<StylistWorkHourDto>> GetWorkHoursByStylistIdAsync(Guid stylistId)
        {
            var workHours = await _repository.GetByStylistIdAsync(stylistId);
            return workHours.Select(x => MapToDto(x)).ToList();
        }

        private static StylistWorkHourDto MapToDto(StylistWorkHours entity)
        {
            return new StylistWorkHourDto
            {
                Id = entity.ID,
                StylistId = entity.StylistId,
                DayOfWeek = entity.DayOfWeek, 
                DayName = entity.DayOfWeek.ToString(), 
                StartTime = entity.StartTime,
                EndTime = entity.EndTime
            };
        }
    }
}