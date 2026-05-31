using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Services
{
    public interface IPhotoService
    {
        Task<string> AddPhotoAsync(IFormFile file);
    }
}
