using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Application.DTOs.Salons
{
    public class UpdateSalonDto : CreateSalonDto
    {
        public string? LogoUrl { get; set; }

        public string? CoverImageUrl { get; set; }
    }
}
