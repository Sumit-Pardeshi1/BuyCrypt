using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuyCrypt.Application.DTOs
{
    public class BuyAssetRequest
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid WalletId { get; set; }

        [Required]
        [StringLength(100)]
        public string CoinId { get; set; } = null!;

        [Required]
        [StringLength(20)]
        public string Symbol { get; set; } = null!;

        [Required]
        [StringLength(200)]
        public string CoinName { get; set; } = null!;

        [Required]
        [Range(0.00000001, double.MaxValue)]
        public decimal Quantity { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }
    }

    public class SellAssetRequest
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid WalletId { get; set; }

        [Required]
        [StringLength(100)]
        public string CoinId { get; set; } = null!;

        [Required]
        [Range(0.00000001, double.MaxValue)]
        public decimal Quantity { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }
    }

    public class TradeResponse
    {
        public Guid TransactionId { get; set; }
        public string TransactionType { get; set; } = null!;
        public string CoinId { get; set; } = null!;
        public string Symbol { get; set; } = null!;
        public decimal Quantity { get; set; }
        public decimal PricePerCoin { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Fees { get; set; }
        public decimal NewWalletBalance { get; set; }
        public DateTime TransactionDate { get; set; }
        public string Message { get; set; } = null!;
    }
}
