using MySalon.Domain.Entities;
using MySalon.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Application.DTOs.Services
{
    public class ServiceDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

       
        public string Description { get; set; }

        public string Category { get; set; }
        public string? ImageUrl { get; set; }

    }
}
