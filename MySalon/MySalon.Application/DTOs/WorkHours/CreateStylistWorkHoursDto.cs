using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Application.DTOs.WorkHours
{
    public class CreateStylistWorkHoursDto
    {
        [Required(ErrorMessage = "StylistId is required")]
        public Guid StylistId { get; set; }

        [Required(ErrorMessage = "DayOfWeek is required")]
        public DayOfWeek DayOfWeek { get; set; }

        [Required(ErrorMessage = "Start time is required")]
        public TimeSpan StartTime { get; set; }

        [Required(ErrorMessage = "End Time is required")]
        public TimeSpan EndTime { get; set; }

    }
}
