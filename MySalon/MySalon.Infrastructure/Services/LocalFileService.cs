using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using MySalon.Application.Interfaces;
using MySalon.Application.Interfaces.Services;
using System;
using System.IO;
using System.Threading.Tasks;

namespace MySalon.Infrastructure.Services
{
    public class LocalFileService : IFileService
    {
        private readonly IWebHostEnvironment _env;

        public LocalFileService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> UploadFileAsync(IFormFile file, string folderName = "uploads")
        {
            if (file == null || file.Length == 0)
                return string.Empty;

            var folderPath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), folderName);

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var fileExtension = Path.GetExtension(file.FileName);
            var uniqueFileName = Guid.NewGuid().ToString() + fileExtension;
            var filePath = Path.Combine(folderPath, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/{folderName}/{uniqueFileName}";
        }
    }
}