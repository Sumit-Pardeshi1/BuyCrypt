using System;

namespace BuyCrypt.Domain.Models
{
    public class Transaction
    {
        public Guid TransactionId { get; private set; }
        public Guid UserId { get; private set; }
        public Guid WalletId { get; private set; }
        public string CoinId { get; private set; } = null!;
        public string Symbol { get; private set; } = null!;
        public string TransactionType { get; private set; } = null!; // "BUY" or "SELL"
        public decimal Quantity { get; private set; }
        public decimal PricePerCoin { get; private set; }
        public decimal TotalAmount { get; private set; }
        public decimal Fees { get; private set; }
        public DateTime TransactionDate { get; private set; }
        public string? Notes { get; private set; }

        // Navigation Properties
        public UserProfile User { get; private set; } = null!;
        public Wallet Wallet { get; private set; } = null!;

        // Parameterless constructor for EF Core
        public Transaction() { }

        // Parameterized constructor for business logic
        public Transaction(
            Guid userId,
            Guid walletId,
            string coinId,
            string symbol,
            string transactionType,
            decimal quantity,
            decimal pricePerCoin,
            decimal totalAmount,
            decimal fees,
            string? notes)
        {
            TransactionId = Guid.NewGuid();
            UserId = userId;
            WalletId = walletId;
            CoinId = coinId;
            Symbol = symbol;
            TransactionType = transactionType;
            Quantity = quantity;
            PricePerCoin = pricePerCoin;
            TotalAmount = totalAmount;
            Fees = fees;
            TransactionDate = DateTime.UtcNow;
            Notes = notes;
        }
    }
}
