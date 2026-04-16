using System.ComponentModel.DataAnnotations;

namespace BuyCrypt.Application.DTOs
{
    public class CreateWalletRequest
    {
        [Required]
        public Guid UserId { get; set; }

        [StringLength(10)]
        public string Currency { get; set; } = "INR";
    }

    public class WalletResponse
    {
        public Guid WalletId { get; set; }
        public Guid UserId { get; set; }
        public decimal Balance { get; set; }
        public string Currency { get; set; } = "INR";
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class WalletTransactionRequest
    {
        [Required]
        public Guid WalletId { get; set; }

        [Range(1, double.MaxValue)]
        public decimal Amount { get; set; }
    }
}
