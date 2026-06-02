using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Application.DTOs.Stylists
{
    public class UpdateStylistDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Bio { get; set; }
        public string ? ImageUrl { get; set; }

        public IFormFile? ImageFile { get; set; }
    }
}