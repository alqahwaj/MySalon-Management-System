using Microsoft.AspNetCore.Identity;
using MySalon.Application.DTOs.Stylists;
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
    public class StylistAppService : IStylistAppService
    {
        private readonly IStylistRepository _repository;
        private readonly IBookingRepository _bookingRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPhotoService _photoService; 

        public StylistAppService(
            IStylistRepository repository,
            IBookingRepository bookingRepository,
            UserManager<ApplicationUser> userManager,
            IPhotoService photoService) 
        {
            _repository = repository;
            _bookingRepository = bookingRepository;
            _userManager = userManager;
            _photoService = photoService;
        }

        public async Task<StylistDto> CreateStylistAsync(CreateStylistDto dto)
        {
            var existingStylist = await _repository.GetByEmailAsync(dto.Email);

            if (existingStylist != null)
                throw new BadRequestException("This email is already registered.");

            var user = new ApplicationUser { UserName = dto.Email, Email = dto.Email };
            var userResult = await _userManager.CreateAsync(user, dto.Password);

            if (!userResult.Succeeded)
                throw new BadRequestException("Error creating identity user.");

            await _userManager.AddToRoleAsync(user, "Stylist");

            string? imageUrl = dto.ImageUrl;
            if (dto.ImageFile != null)
            {
                imageUrl = await _photoService.AddPhotoAsync(dto.ImageFile);
            }

            var newStylist = new Stylist
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                SalonId = dto.SalonId,
                Phone = dto.Phone,
                Email = dto.Email,
                Bio = dto.Bio,
                ImageUrl = imageUrl, 
                IsActive = true,
                ApplicationUserId = user.Id
            };

            var savedStylist = await _repository.AddAsync(newStylist);
            return MapToDto(savedStylist);
        }

        public async Task<IEnumerable<StylistDto>> GetAllStylistsAsync()
        {
            var stylists = await _repository.GetAllAsync();
            return stylists.Select(s => MapToDto(s)).ToList();
        }

        public async Task<StylistDto?> GetStylistByEmailAsync(string email)
        {
            var stylist = await _repository.GetByEmailAsync(email);
            if (stylist == null) return null;
            return MapToDto(stylist);
        }

        public async Task<StylistDto?> GetStylistByIdAsync(Guid id)
        {
            var stylist = await _repository.GetByIdAsync(id);
            if (stylist == null) return null;
            return MapToDto(stylist);
        }

        private static StylistDto MapToDto(Stylist stylist)
        {
            return new StylistDto
            {
                Id = stylist.ID,
                FirstName = stylist.FirstName,
                LastName = stylist.LastName,
                Email = stylist.Email,
                Phone = stylist.Phone,
                Bio = stylist.Bio ?? string.Empty,
                Rating = stylist.Rating,
                ImageUrl = stylist.ImageUrl ?? string.Empty,
                IsActive = stylist.IsActive
            };
        }

        public async Task<StylistDto> UpdateStylistAsync(Guid id, UpdateStylistDto dto)
        {
            var stylist = await _repository.GetByIdAsync(id);

            if (stylist == null)
                throw new NotFoundException(nameof(Stylist), id);

            if (dto.Email != stylist.Email)
            {
                var existingUserWithEmail = await _repository.GetByEmailAsync(dto.Email);

                if (existingUserWithEmail != null && existingUserWithEmail.ID != id)
                {
                    throw new BadRequestException("This email is already taken by another user.");
                }
            }

            stylist.FirstName = dto.FirstName;
            stylist.LastName = dto.LastName;
            stylist.Phone = dto.Phone;
            stylist.Email = dto.Email;
            stylist.Bio = dto.Bio;

            // 👈 لوجيك تحديث الصورة على Cloudinary
            if (dto.ImageFile != null)
            {
                stylist.ImageUrl = await _photoService.AddPhotoAsync(dto.ImageFile);
            }
            else if (!string.IsNullOrEmpty(dto.ImageUrl))
            {
                stylist.ImageUrl = dto.ImageUrl;
            }

            await _repository.UpdateAsync(stylist);
            return MapToDto(stylist);
        }

        public async Task DeleteStylistAsync(Guid id)
        {
            var stylist = await _repository.GetByIdAsync(id);

            if (stylist == null)
                throw new NotFoundException(nameof(Stylist), id);

            bool hasBookings = await _bookingRepository.HasActiveBookingsForStylistAsync(id);

            if (hasBookings)
            {
                throw new BadRequestException("Cannot delete Stylist because they have active upcoming bookings. Please cancel them first.");
            }

            await _repository.DeleteAsync(stylist);
        }

        public async Task<StylistDto?> GetStylistByUserIdAsync(string userId)
        {
            var stylist = await _repository.GetByUserIdAsync(userId);
            return stylist == null ? null : MapToDto(stylist);
        }
    }
}