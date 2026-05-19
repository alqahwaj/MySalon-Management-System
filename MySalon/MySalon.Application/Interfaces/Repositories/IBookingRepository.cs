using MySalon.Domain.Entities;
using MySalon.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Repositories
{
    public interface IBookingRepository
    {
        Task<Booking> AddAsync(Booking booking);
        Task UpdateAsync(Booking booking);

        Task<Booking?> GetByIdAsync(Guid id);
        Task<IEnumerable<Booking>> GetBookingsByStylistAsync(Guid stylistId, DateTime? date = null, BookingStatus? status = null);

        Task<IEnumerable<Booking>> GetBookingsByCustomerAsync(Guid customerId, BookingStatus? status = null, DateTime? date = null);

        Task<IEnumerable<Booking>> GetBookingsBySalonAsync(Guid salonId, DateTime? date = null, BookingStatus? status = null);

        Task<bool> HasActiveBookingsForCustomerAsync(Guid customerId);

        Task<bool> HasActiveBookingsForStylistAsync(Guid stylistId);

        Task<(IEnumerable<Booking> Items, int TotalCount)> GetPagedBookingsByCustomerAsync(Guid customerId,int page,int pageSize,BookingStatus? status);

        Task<(IEnumerable<Booking> Items, int TotalCount)> GetAllPagedBookingsAsync(int page, int pageSize, BookingStatus? status);
    }
}