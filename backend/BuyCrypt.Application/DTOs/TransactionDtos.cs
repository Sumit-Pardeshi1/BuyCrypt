using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuyCrypt.Application.DTOs
{
    public class TransactionResponse
    {
        public Guid TransactionId { get; set; }
        public Guid UserId { get; set; }
        public Guid WalletId { get; set; }
        public string CoinId { get; set; } = null!;
        public string Symbol { get; set; } = null!;
        public string TransactionType { get; set; } = null!;
        public decimal Quantity { get; set; }
        public decimal PricePerCoin { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Fees { get; set; }
        public DateTime TransactionDate { get; set; }
        public string? Notes { get; set; }
    }

    public class TransactionHistoryResponse
    {
        public Guid UserId { get; set; }
        public int TotalTransactions { get; set; }
        public decimal TotalBuyAmount { get; set; }
        public decimal TotalSellAmount { get; set; }
        public List<TransactionResponse> Transactions { get; set; } = new();
    }
}
