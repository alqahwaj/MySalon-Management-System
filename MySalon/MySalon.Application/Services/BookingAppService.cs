using MySalon.Application.DTOs.Bookings;
using MySalon.Application.Exceptions;
using MySalon.Application.Interfaces.Repositories;
using MySalon.Application.Interfaces.Services;
using MySalon.Domain.Entities;
using MySalon.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MySalon.Application.DTOs.Common;

namespace MySalon.Application.Services
{
    public class BookingAppService : IBookingAppService
    {
        private readonly IBookingRepository _bookingrepository;
        private readonly IStylistRepository _stylistRepository;
        private readonly ISalonServiceRepository _salonServiceRepository;
        private readonly IStylistWorkHoursRepository _workHoursRepository;
        private readonly ICurrentUserService _currentUserService; // 👈 إضافة خدمة المستخدم الحالي
        private readonly ICustomerRepository _customerRepository; // 👈 إضافة مستودع العملاء لجلب الـ ApplicationUserId

        public BookingAppService(
            IBookingRepository bookingrepository,
            IStylistRepository stylistRepository,
            ISalonServiceRepository salonServiceRepository,
            IStylistWorkHoursRepository workHoursRepository,
            ICurrentUserService currentUserService,
            ICustomerRepository customerRepository)
        {
            _bookingrepository = bookingrepository;
            _stylistRepository = stylistRepository;
            _salonServiceRepository = salonServiceRepository;
            _workHoursRepository = workHoursRepository;
            _currentUserService = currentUserService;
            _customerRepository = customerRepository;
        }

        public async Task<BookingDto> CreateBookingAsync(CreateBookingDto dto)
        {
            if (!dto.CustomerId.HasValue)
            {
                throw new ArgumentException("Customer ID is required to create a booking.");
            }

            if (dto.StartTime < DateTime.Now)
            {
                throw new Exception("Cannot book an appointment in the past.");
            }

            // 👇 الحماية: التحقق من أن المستخدم الحالي يملك حساب العميل المذكور في الطلب
            var customer = await _customerRepository.GetByIdAsync(dto.CustomerId.Value);
            _currentUserService.EnsureOwnershipOrIsAdmin(customer?.ApplicationUserId);

            var salonService = await _salonServiceRepository.GetByIdAsync(dto.SalonServiceId);
            if (salonService == null)
                throw new NotFoundException(nameof(SalonService), dto.SalonServiceId);

            var duration = salonService.DurationMinutes;
            var bookingEndTime = dto.StartTime.AddMinutes(duration);
            var dayOfWeek = dto.StartTime.DayOfWeek;

            var allWorkHours = await _workHoursRepository.GetByStylistIdAsync(dto.StylistId);
            var todayWorkHour = allWorkHours.FirstOrDefault(w => w.DayOfWeek == dayOfWeek);

            if (todayWorkHour == null)
                throw new Exception($"Stylist is not working on {dayOfWeek}.");

            if (dto.StartTime.TimeOfDay < todayWorkHour.StartTime || bookingEndTime.TimeOfDay > todayWorkHour.EndTime)
                throw new Exception("Booking time is outside of stylist's working hours.");

            var existingBookings = await _bookingrepository.GetBookingsByStylistAsync(dto.StylistId, date: dto.StartTime.Date);

            bool hasConflict = existingBookings.Any(b =>
                b.Status != BookingStatus.Cancelled &&
                dto.StartTime < b.EndTime &&
                b.StartTime < bookingEndTime
            );

            if (hasConflict)
                throw new Exception("Stylist is fully booked at this time slot.");

            var newBooking = new Booking
            {
                CustomerId = dto.CustomerId.Value,
                StylistId = dto.StylistId,
                SalonId = dto.SalonId,
                SalonServiceId = dto.SalonServiceId,
                StartTime = dto.StartTime,
                EndTime = bookingEndTime,
                TotalPrice = salonService.Price,
                Status = BookingStatus.Pending,
                Note = dto.Note
            };

            var savedBooking = await _bookingrepository.AddAsync(newBooking);
            return MapToDto(savedBooking);
        }

        public async Task<DTOs.Common.PagedResult<BookingDto>> GetAllBookingsAsync(int page, int pageSize, BookingStatus? status)
        {
            var (items, totalCount) = await _bookingrepository.GetAllPagedBookingsAsync(page, pageSize, status);

            return new DTOs.Common.PagedResult<BookingDto>
            {
                Items = items.Select(MapToDto).ToList(),
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task CancelBookingAsync(Guid id)
        {
            var booking = await _bookingrepository.GetByIdAsync(id);
            if (booking == null)
                throw new NotFoundException(nameof(Booking), id);

            // 👇 الحماية: جلب بيانات العميل المرتبط بالحجز للتحقق من ملكيته
            var customer = await _customerRepository.GetByIdAsync(booking.CustomerId);
            _currentUserService.EnsureOwnershipOrIsAdmin(customer?.ApplicationUserId);

            if (booking.Status == BookingStatus.Completed || booking.Status == BookingStatus.Cancelled)
                throw new Exception("Cannot cancel a completed or already cancelled booking.");

            booking.Status = BookingStatus.Cancelled;

            await _bookingrepository.UpdateAsync(booking);
        }

        public async Task<BookingDto> RescheduleBookingAsync(Guid id, DateTime newTime)
        {
            var booking = await _bookingrepository.GetByIdAsync(id);
            if (booking == null)
                throw new NotFoundException(nameof(Booking), id);

            // 👇 الحماية: جلب بيانات العميل المرتبط بالحجز للتحقق من ملكيته قبل إعادة الجدولة
            var customer = await _customerRepository.GetByIdAsync(booking.CustomerId);
            _currentUserService.EnsureOwnershipOrIsAdmin(customer?.ApplicationUserId);

            if (booking.StartTime == newTime)
                return MapToDto(booking);

            if (booking.SalonService == null)
            {
                var service = await _salonServiceRepository.GetByIdAsync(booking.SalonServiceId);
                if (service == null) throw new NotFoundException("Service", booking.SalonServiceId);
                booking.SalonService = service;
            }

            var duration = booking.SalonService.DurationMinutes;
            var newEndTime = newTime.AddMinutes(duration);

            var allWorkHours = await _workHoursRepository.GetByStylistIdAsync(booking.StylistId);
            var workHour = allWorkHours.FirstOrDefault(w => w.DayOfWeek == newTime.DayOfWeek);

            if (workHour == null || newTime.TimeOfDay < workHour.StartTime || newEndTime.TimeOfDay > workHour.EndTime)
                throw new Exception("The new time is outside of working hours.");

            var existingBookings = await _bookingrepository.GetBookingsByStylistAsync(booking.StylistId, date: newTime.Date);

            bool hasConflict = existingBookings.Any(b =>
                b.ID != booking.ID &&
                b.Status != BookingStatus.Cancelled &&
                newTime < b.EndTime &&
                b.StartTime < newEndTime
            );

            if (hasConflict)
                throw new Exception("Stylist is fully booked at the new time slot.");

            booking.StartTime = newTime;
            booking.EndTime = newEndTime;
            if (booking.Status == BookingStatus.Cancelled) booking.Status = BookingStatus.Pending;

            await _bookingrepository.UpdateAsync(booking);

            return MapToDto(booking);
        }

        public async Task<BookingDto?> GetBookingByIdAsync(Guid id)
        {
            var booking = await _bookingrepository.GetByIdAsync(id);
            return booking == null ? null : MapToDto(booking);
        }

        public async Task<IEnumerable<BookingDto>> GetBookingsByStylistAsync(Guid stylistId, DateTime? date = null, BookingStatus? status = null)
        {
            var bookings = await _bookingrepository.GetBookingsByStylistAsync(stylistId, date, status);
            return bookings.Select(MapToDto).ToList();
        }

        public async Task<IEnumerable<BookingDto>> GetBookingsByCustomerAsync(Guid customerId, DateTime? date = null, BookingStatus? status = null)
        {
            var bookings = await _bookingrepository.GetBookingsByCustomerAsync(customerId, status, date);
            return bookings.Select(MapToDto).ToList();
        }

        public async Task<IEnumerable<BookingDto>> GetBookingsBySalonAsync(Guid salonId, DateTime? date = null, BookingStatus? status = null)
        {
            var bookings = await _bookingrepository.GetBookingsBySalonAsync(salonId, date, status);
            return bookings.Select(MapToDto).ToList();
        }

        public async Task<IReadOnlyList<DateTime>> GetAvailableSlotsAsync(Guid stylistId, Guid serviceId, DateTime date)
        {
            const int SlotIntervalMinutes = 30;

            var service = await _salonServiceRepository.GetByIdAsync(serviceId)
                          ?? throw new NotFoundException("Service", serviceId);

            var stylistWorkHours = await _workHoursRepository.GetByStylistIdAsync(stylistId);
            var workHoursForDay = stylistWorkHours?.FirstOrDefault(w => w.DayOfWeek == date.DayOfWeek);

            if (workHoursForDay == null)
                return Array.Empty<DateTime>();

            var bookings = await _bookingrepository.GetBookingsByStylistAsync(stylistId, date: date.Date);

            var availableSlots = new List<DateTime>();
            var serviceDuration = TimeSpan.FromMinutes(service.DurationMinutes);
            var workStartTime = date.Date.Add(workHoursForDay.StartTime);
            var workEndTime = date.Date.Add(workHoursForDay.EndTime);

            var currentSlotStart = workStartTime;

            while (currentSlotStart + serviceDuration <= workEndTime)
            {
                var currentSlotEnd = currentSlotStart + serviceDuration;

                bool hasConflict = bookings.Any(b =>
                    b.Status != BookingStatus.Cancelled &&
                    currentSlotStart < b.EndTime &&
                    b.StartTime < currentSlotEnd
                );

                if (!hasConflict)
                    availableSlots.Add(currentSlotStart);

                currentSlotStart = currentSlotStart.AddMinutes(SlotIntervalMinutes);
            }

            return availableSlots;
        }

        public async Task<IEnumerable<BookingDto>> GetMyStylistBookingsAsync(string applicationUserId, DateTime? date = null, BookingStatus? status = null)
        {
            var stylist = await _stylistRepository.GetByUserIdAsync(applicationUserId);

            if (stylist == null)
                throw new UnauthorizedAccessException("Stylist profile not found.");

            return await GetBookingsByStylistAsync(stylist.ID, date, status);
        }

        private static BookingDto MapToDto(Booking booking)
        {
            return new BookingDto
            {
                Id = booking.ID,
                CustomerName = booking.Customer?.FullName ?? "Unknown Customer",
                StylistName = booking.Stylist?.FullName ?? "Unknown Stylist",
                ServiceName = booking.SalonService?.Service?.Name ?? "Unknown Service",
                SalonName = booking.Salon?.Name ?? "Unknown Salon",
                CustomerId = booking.CustomerId,
                StylistId = booking.StylistId,
                SalonServiceId = booking.SalonServiceId,
                SalonId = booking.SalonId,
                StartTime = booking.StartTime,
                EndTime = booking.EndTime,
                Status = booking.Status.ToString(),
                TotalPrice = booking.TotalPrice,
                Note = booking.Note
            };
        }

        public async Task<DTOs.Common.PagedResult<BookingDto>> GetMyBookingsAsync(Guid customerId, int page, int pageSize, BookingStatus? status)
        {
            // 👇 الحماية: منع أي شخص من استعراض قائمة حجوزات لا تخصه
            var customer = await _customerRepository.GetByIdAsync(customerId);
            _currentUserService.EnsureOwnershipOrIsAdmin(customer?.ApplicationUserId);

            var (items, totalCount) = await _bookingrepository.GetPagedBookingsByCustomerAsync(customerId, page, pageSize, status);

            return new DTOs.Common.PagedResult<BookingDto>
            {
                Items = items.Select(MapToDto).ToList(),
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task UpdateBookingStatusAsync(Guid id, BookingStatus newStatus)
        {
            var booking = await _bookingrepository.GetByIdAsync(id);
            if (booking == null)
                throw new NotFoundException(nameof(Booking), id);

            booking.Status = newStatus;

            await _bookingrepository.UpdateAsync(booking);
        }
    }
}