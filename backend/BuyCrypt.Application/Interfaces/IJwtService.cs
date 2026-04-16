// ============================================================
// FILE TO ADD:
// BuyCrypt.Application/Interfaces/IJwtService.cs
// ============================================================

namespace BuyCrypt.Application.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(Guid userId, string email, string fullName);
    }
}
