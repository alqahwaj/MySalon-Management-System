using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySalon.Application.DTOs.Bookings;
using MySalon.Application.Interfaces.Services;
using MySalon.Domain.Enums;
using System.Linq.Dynamic.Core;
using System.Security.Claims;

namespace MySalon.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly IBookingAppService _bookingAppService;
        private readonly ICustomerAppService _customerAppService;
        private readonly IStylistAppService _stylistAppService;

        public BookingController(
            IBookingAppService bookingAppService,
            ICustomerAppService customerAppService,
            IStylistAppService stylistAppService)
        {
            _bookingAppService = bookingAppService;
            _customerAppService = customerAppService;
            _stylistAppService = stylistAppService;
        }

        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> Create(CreateBookingDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var customer = await _customerAppService.GetCustomerByUserIdAsync(userId!);
            if (customer == null)
                return Unauthorized(new { message = "Customer profile not found." });

            dto.CustomerId = customer.Id;

            var result = await _bookingAppService.CreateBookingAsync(dto);

            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")] 
        public async Task<ActionResult<PagedResult<BookingDto>>> GetAllBookingsForAdmin([FromQuery] int page = 1,[FromQuery] int pageSize = 10,[FromQuery] BookingStatus? status = null)
        {
            var result = await _bookingAppService.GetAllBookingsAsync(page, pageSize, status);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookingDto>> GetById(Guid id)
        {
            var booking = await _bookingAppService.GetBookingByIdAsync(id);
            if (booking == null)
                return NotFound();

            if (!await IsAuthorizedForBookingAsync(booking))
                return Forbid();

            return Ok(booking);
        }

        [HttpPut("{id}/cancel")]
        [Authorize(Roles = "Admin,Customer,Stylist")]
        public async Task<IActionResult> Cancel(Guid id)
        {
            var booking = await _bookingAppService.GetBookingByIdAsync(id);
            if (booking == null)
                return NotFound();

            if (!await IsAuthorizedForBookingAsync(booking))
                return Forbid();

            await _bookingAppService.CancelBookingAsync(id);
            return NoContent();
        }

        [HttpPut("{id}/reschedule")]
        [Authorize(Roles = "Customer,Stylist")]
        public async Task<ActionResult<BookingDto>> Reschedule(Guid id, [FromBody] DateTime newTime)
        {
            var booking = await _bookingAppService.GetBookingByIdAsync(id);
            if (booking == null)
                return NotFound();

            if (!await IsAuthorizedForBookingAsync(booking))
                return Forbid();

            var result = await _bookingAppService.RescheduleBookingAsync(id, newTime);
            return Ok(result);
        }

        [HttpGet("available-slots")]
        [AllowAnonymous]
        public async Task<ActionResult<IReadOnlyList<DateTime>>> GetAvailableSlots(
            [FromQuery] Guid stylistId,
            [FromQuery] Guid serviceId,
            [FromQuery] DateTime date)
        {
            var slots = await _bookingAppService.GetAvailableSlotsAsync(stylistId, serviceId, date);
            return Ok(slots);
        }

        private async Task<bool> IsAuthorizedForBookingAsync(BookingDto booking)
        {
            if (User.IsInRole("Admin"))
                return true;

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return false;

            if (User.IsInRole("Customer"))
            {
                var customer = await _customerAppService.GetCustomerByUserIdAsync(userId);
                return customer != null && customer.Id == booking.CustomerId;
            }

            if (User.IsInRole("Stylist"))
            {
                var stylist = await _stylistAppService.GetStylistByUserIdAsync(userId);
                return stylist != null && stylist.Id == booking.StylistId;
            }

            return false;
        }

        [HttpGet("customer/all")]
        [Authorize(Roles = "Customer")]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetMyBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var customer = await _customerAppService.GetCustomerByUserIdAsync(userId!);
            if (customer == null)
                return Unauthorized(new { message = "Customer profile not found." });

            var bookings = await _bookingAppService.GetBookingsByCustomerAsync(customer.Id);
            return Ok(bookings);
        }

        [HttpGet("customer")]
        [Authorize(Roles = "Customer")]
        public async Task<ActionResult<PagedResult<BookingDto>>> GetMyBookings(int page = 1,int pageSize = 5,BookingStatus? status = null)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var customer = await _customerAppService.GetCustomerByUserIdAsync(userId!);

            var result = await _bookingAppService.GetMyBookingsAsync(customer.Id, page, pageSize, status);

            return Ok(result);
        }

        [HttpGet("stylist/all")]
        [Authorize(Roles = "Stylist")]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetMyStylistBookings([FromQuery] DateTime? date = null, [FromQuery] BookingStatus? status = null)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "User ID not found in token." });

            try
            {
                var bookings = await _bookingAppService.GetMyStylistBookingsAsync(userId, date, status);
                return Ok(bookings);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        //[HttpPut("{id}/status")]
        //[Authorize(Roles = "Admin,Stylist")] 
        //public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] BookingStatus status)
        //{
        //    var booking = await _bookingAppService.GetBookingByIdAsync(id);
        //    if (booking == null) return NotFound();

        //    if (!await IsAuthorizedForBookingAsync(booking))
        //        return Forbid();

        //    await _bookingAppService.UpdateBookingStatusAsync(id, status);
        //    return NoContent();
        //}

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin,Stylist")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequestDto request)
        {
            var booking = await _bookingAppService.GetBookingByIdAsync(id);
            if (booking == null) return NotFound(new { message = "Booking not found." });

            if (!await IsAuthorizedForBookingAsync(booking))
                return Forbid();

            if (!Enum.TryParse<BookingStatus>(request.Status, true, out var newStatus))
            {
                return BadRequest(new { message = "Invalid status value. It must be Pending, Completed, or Cancelled." });
            }

            await _bookingAppService.UpdateBookingStatusAsync(id, newStatus);

            return Ok(new { message = "Status updated successfully." });
        }

    }
}