using MySalon.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http; 

namespace MySalon.Application.DTOs.Services
{
    public class CreateServiceDto
    {
        [Required(ErrorMessage = "Name Services is required")]
        [MaxLength(50, ErrorMessage = "Services name cannot exceed 50 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Description Services is required")]
        [MaxLength(255, ErrorMessage = "Services Description cannot exceed 255 characters")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Category is required")]
        public ServiceCategory? Category { get; set; }

        public string? ImageUrl { get; set; }

        // 👈 الخاصية الجديدة لاستقبال ملف الصورة من الفرونت إند
        public IFormFile? ImageFile { get; set; }
    }
}