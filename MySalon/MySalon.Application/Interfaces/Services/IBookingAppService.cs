using MySalon.Application.DTOs.Bookings;
using MySalon.Domain.Enums;
using System.Linq.Dynamic.Core;

namespace MySalon.Application.Interfaces.Services
{
    public interface IBookingAppService
    {
        Task<BookingDto> CreateBookingAsync(CreateBookingDto dto);

        Task<DTOs.Common.PagedResult<BookingDto>> GetAllBookingsAsync(int page, int pageSize, BookingStatus? status);

        Task<BookingDto> RescheduleBookingAsync(Guid id, DateTime newTime);

        Task CancelBookingAsync(Guid id);

        Task<BookingDto?> GetBookingByIdAsync(Guid id);

        Task<IEnumerable<BookingDto>> GetBookingsByStylistAsync(Guid stylistId, DateTime? date = null, BookingStatus? status = null);

        Task<IEnumerable<BookingDto>> GetBookingsByCustomerAsync(Guid customerId, DateTime? date = null, BookingStatus? status = null);

        Task<IEnumerable<BookingDto>> GetBookingsBySalonAsync(Guid salonId, DateTime? date = null, BookingStatus? status = null);

        Task<IReadOnlyList<DateTime>> GetAvailableSlotsAsync(Guid stylistId, Guid serviceId, DateTime date);

        public Task<MySalon.Application.DTOs.Common.PagedResult<BookingDto>> GetMyBookingsAsync(Guid customerId, int page, int pageSize, BookingStatus? status);

        Task<IEnumerable<BookingDto>> GetMyStylistBookingsAsync(string applicationUserId, DateTime? date = null, BookingStatus? status = null);

        Task UpdateBookingStatusAsync(Guid id, BookingStatus newStatus);
    }
}