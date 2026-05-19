using System;

namespace MySalon.Application.DTOs.StylistWorkHours
{
    public class StylistWorkHourDto
    {
        public Guid Id { get; set; }
        public Guid StylistId { get; set; }
        public DayOfWeek DayOfWeek { get; set; } 
        public string DayName { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public bool IsAvailable { get; set; }
    }
}