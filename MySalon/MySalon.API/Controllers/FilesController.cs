using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySalon.Application.Interfaces;
using MySalon.Application.Interfaces.Services;
using System.Threading.Tasks;

namespace MySalon.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly IFileService _fileService;

        public FilesController(IFileService fileService)
        {
            _fileService = fileService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            var imageUrl = await _fileService.UploadFileAsync(file);

            if (string.IsNullOrEmpty(imageUrl))
            {
                return BadRequest(new { message = "No file uploaded." });
            }

            return Ok(new { url = imageUrl });
        }
    }
}