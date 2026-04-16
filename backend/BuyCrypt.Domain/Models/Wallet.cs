namespace BuyCrypt.Domain.Models
{
    public class Wallet
    {
        public Guid WalletId { get; private set; }
        public Guid UserId { get; private set; }
        public decimal Balance { get; private set; }
        public string Currency { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        public ICollection<Transaction> Transactions { get; private set; } = new List<Transaction>();
        public UserProfile User { get; private set; } = null!;

        private Wallet() { } // EF Core

        public Wallet(Guid userId, string currency)
        {
            WalletId = Guid.NewGuid();
            UserId = userId;
            Currency = currency;
            Balance = 0;
            CreatedAt = DateTime.UtcNow;
        }

        public void Deposit(decimal amount)
        {
            if (amount <= 0)
                throw new InvalidOperationException("Amount must be greater than zero");

            Balance += amount;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Withdraw(decimal amount)
        {
            if (amount <= 0)
                throw new InvalidOperationException("Amount must be greater than zero");

            if (Balance < amount)
                throw new InvalidOperationException("Insufficient balance");

            Balance -= amount;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
