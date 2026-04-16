// ============================================================
// FILE TO REPLACE:
// BuyCrypt.Domain/Models/UserProfile.cs
// Added: PasswordHash property (needed for BCrypt login)
// ============================================================

namespace BuyCrypt.Domain.Models
{
    public class UserProfile
    {
        public Guid UserId { get; private set; }
        public string FullName { get; private set; } = null!;
        public string Email { get; private set; } = null!;
        public string? PhoneNumber { get; private set; }
        public string PreferredCurrency { get; private set; } = "INR";

        // Stores BCrypt hash — set by AuthController.Register
        // Null for users created via old /api/users endpoint
        public string? PasswordHash { get; private set; }

        public DateTime CreatedAt { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        // Navigation Properties
        public ICollection<Wallet> Wallets { get; private set; }
            = new List<Wallet>();
        public ICollection<PortfolioAsset> PortfolioAssets { get; private set; }
            = new List<PortfolioAsset>();
        public ICollection<Transaction> Transactions { get; private set; }
            = new List<Transaction>();
        public ICollection<FavoriteCoin> FavoriteCoins { get; private set; }
            = new List<FavoriteCoin>();
        public ICollection<PortfolioSnapshot> PortfolioSnapshots { get; private set; }
            = new List<PortfolioSnapshot>();
    }
}
