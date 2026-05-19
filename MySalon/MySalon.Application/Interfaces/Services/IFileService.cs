using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace MySalon.Application.Interfaces.Services
{
    public interface IFileService
    {
        Task<string> UploadFileAsync(IFormFile file, string folderName = "uploads");
    }
}
