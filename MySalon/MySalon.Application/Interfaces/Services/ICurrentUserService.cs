namespace MySalon.Application.Interfaces.Services
{
    public interface ICurrentUserService
    {
        string? GetUserId();
        bool IsAdmin();

        void EnsureOwnershipOrIsAdmin(string? resourceUserId);
    }
}
