using Microsoft.EntityFrameworkCore;
using MySalon.Application.Interfaces.Repositories;
using MySalon.Domain.Entities;
using MySalon.Domain.Enums;
using MySalon.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MySalon.Infrastructure.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly MySalonDbContext _context;

        public BookingRepository(MySalonDbContext context)
        {
            _context = context;
        }

        public async Task<Booking> AddAsync(Booking booking)
        {
            await _context.Bookings.AddAsync(booking);
            await _context.SaveChangesAsync();
            return booking;
        }

        public async Task UpdateAsync(Booking booking)
        {
            _context.Bookings.Update(booking);
            await _context.SaveChangesAsync();
        }

        public async Task<Booking?> GetByIdAsync(Guid id)
        {
            return await _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Stylist)
                .Include(b => b.Salon)
                .Include(b => b.SalonService).ThenInclude(ss => ss.Service)
                .FirstOrDefaultAsync(b => b.ID == id);
        }

        public async Task<IEnumerable<Booking>> GetBookingsByStylistAsync(Guid stylistId, DateTime? date = null, BookingStatus? status = null)
        {
            var query = _context.Bookings
                .Include(b => b.Customer)         
                .Include(b => b.SalonService).ThenInclude(ss => ss.Service) 
                .Where(b => b.StylistId == stylistId);

            if (date.HasValue)
            {
                query = query.Where(b => b.StartTime.Date == date.Value.Date);
            }

            if (status.HasValue)
            {
                query = query.Where(b => b.Status == status.Value);
            }

            return await query
                .OrderByDescending(b => b.StartTime)
                .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetBookingsByCustomerAsync(Guid customerId, BookingStatus? status = null, DateTime? date = null)
        {
            var query = _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Stylist)
                .Include(b => b.SalonService).ThenInclude(ss => ss.Service)
                .Where(b => b.CustomerId == customerId);

            if (status.HasValue)
            {
                query = query.Where(b => b.Status == status.Value);
            }

            if (date.HasValue)
            {
                query = query.Where(b => b.StartTime.Date == date.Value.Date);
            }

            return await query
                .OrderByDescending(b => b.StartTime)
                .ToListAsync();
        }


        public async Task<IEnumerable<Booking>> GetBookingsBySalonAsync(Guid salonId, DateTime? date = null, BookingStatus? status = null)
        {
            var query = _context.Bookings
                .Include(b => b.Customer)      
                .Include(b => b.Stylist)        
                .Include(b => b.SalonService).ThenInclude(ss => ss.Service) 
                .Where(b => b.SalonId == salonId);

            if (date.HasValue)
            {
                query = query.Where(b => b.StartTime.Date == date.Value.Date);
            }

            if (status.HasValue)
            {
                query = query.Where(b => b.Status == status.Value);
            }

            return await query
                .OrderByDescending(b => b.StartTime)
                .ToListAsync();
        }

        public async Task<bool> HasActiveBookingsForCustomerAsync(Guid customerId)
        {
            return await _context.Bookings.AnyAsync(b =>
                b.CustomerId == customerId &&
                (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed) &&
                b.StartTime > DateTime.Now 
            );
        }

        public async Task<bool> HasActiveBookingsForStylistAsync(Guid stylistId)
        {
            return await _context.Bookings.AnyAsync(b =>
               b.StylistId == stylistId &&
               (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed) &&
               b.StartTime > DateTime.Now
           );
        }

        public async Task<(IEnumerable<Booking> Items, int TotalCount)> GetPagedBookingsByCustomerAsync(Guid customerId,int page,int pageSize,BookingStatus? status)
        {
            var query = _context.Bookings.Include(b => b.Customer).Include(b => b.Stylist).Include(b => b.Salon)
                          .Include(b => b.SalonService) .ThenInclude(ss => ss.Service).Where(b => b.CustomerId == customerId);


            if (status.HasValue)
                query = query.Where(b => b.Status == status.Value);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(b => b.StartTime)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<(IEnumerable<Booking> Items, int TotalCount)> GetAllPagedBookingsAsync(int page, int pageSize, BookingStatus? status)
        {
            var query = _context.Bookings
                .IgnoreQueryFilters() 
                .Include(b => b.Customer)
                .Include(b => b.Stylist)
                .Include(b => b.Salon)
                .Include(b => b.SalonService).ThenInclude(ss => ss.Service)
                .AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(b => b.Status == status.Value);
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(b => b.StartTime) 
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

    }
}