using MySalon.Application.DTOs.Customers;
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
    public class CustomerAppService : ICustomerAppService
    {
        private readonly ICustomerRepository _repository;
        private readonly IBookingRepository _bookingRepository;
        private readonly ICurrentUserService _currentUserService;

        public CustomerAppService(ICustomerRepository repository, IBookingRepository bookingRepository, ICurrentUserService currentUserService)
        {
            _repository = repository;
            _bookingRepository = bookingRepository;
            _currentUserService = currentUserService;
        }

        public async Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto dto, string? userId = null)
        {
            var existingCustomer = await _repository.GetByEmailAsync(dto.Email);
            if (existingCustomer != null)
                throw new Exception("This email is already registered.");


            var newCustomer = new Customer
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Phone = dto.Phone,
                Email = dto.Email,
                IsActive = true,
                ApplicationUserId = userId
            };

            var savedCustomer = await _repository.AddAsync(newCustomer);

            return MapToDto(savedCustomer);
        }

        public async Task<IEnumerable<CustomerDto>> GetAllCustomersAsync()
        {
            var customers = await _repository.GetAllAsync();
            return customers.Select(c => MapToDto(c)).ToList();
        }

        public async Task<CustomerDto?> GetCustomerByEmailAsync(string email)
        {
            var customer = await _repository.GetByEmailAsync(email);

            if (customer == null)
                return null;

            return MapToDto(customer);
        }

        public async Task<CustomerDto?> GetCustomerByIdAsync(Guid id)
        {
            var customer = await _repository.GetByIdAsync(id);

            if (customer == null) 
                return null;

            return MapToDto(customer);
        }

        public async Task<CustomerDto> UpdateCustomerAsync(Guid id, CreateCustomerDto dto)
        {
            var customer = await _repository.GetByIdAsync(id);

            if (customer == null)
                throw new NotFoundException(nameof(Customer), id);

            _currentUserService.EnsureOwnershipOrIsAdmin(customer.ApplicationUserId);

            if (dto.Email != customer.Email)
            {
                var existingUserWithEmail = await _repository.GetByEmailAsync(dto.Email);

                if (existingUserWithEmail != null && existingUserWithEmail.ID != id)
                {
                    throw new Exception("This email is already taken by another user.");
                }
            }

            customer.FirstName = dto.FirstName;
            customer.LastName = dto.LastName;
            customer.Phone = dto.Phone;
            customer.Email = dto.Email;

            if (!string.IsNullOrEmpty(dto.ImageUrl))
            {
                customer.ImageUrl = dto.ImageUrl;
            }

            await _repository.UpdateAsync(customer);

            return MapToDto(customer);
        }

        public async Task DeleteCustomerAsync(Guid id)
        {
            var customer = await _repository.GetByIdAsync(id);
            if (customer == null)
                throw new NotFoundException(nameof(Customer), id);

            _currentUserService.EnsureOwnershipOrIsAdmin(customer.ApplicationUserId);

            bool hasBookings = await _bookingRepository.HasActiveBookingsForCustomerAsync(id);

            if (hasBookings)
            {
                throw new Exception("Cannot delete customer because they have active upcoming bookings. Please cancel them first.");
            }

            await _repository.DeleteAsync(customer);
        }

        private static CustomerDto MapToDto(Customer customer)
        {
            return new CustomerDto
            {
                Id = customer.ID,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                Email = customer.Email,
                phone = customer.Phone, 
                ApplicationUserId = customer.ApplicationUserId
            };
        }

        public async Task<CustomerDto?> GetCustomerByUserIdAsync(string userId)
        {
            var customer = await _repository.GetByUserIdAsync(userId);
            return customer == null ? null : MapToDto(customer);
        }
    }
}