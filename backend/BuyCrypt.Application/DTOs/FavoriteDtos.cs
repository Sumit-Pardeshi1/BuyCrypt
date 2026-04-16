using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuyCrypt.Application.DTOs
{
    public class AddFavoriteRequest
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        [StringLength(100)]
        public string CoinId { get; set; } = null!;

        [Required]
        [StringLength(20)]
        public string Symbol { get; set; } = null!;

        [Required]
        [StringLength(200)]
        public string CoinName { get; set; } = null!;
    }

    public class FavoriteResponse
    {
        public Guid FavoriteId { get; set; }
        public Guid UserId { get; set; }
        public string CoinId { get; set; } = null!;
        public string Symbol { get; set; } = null!;
        public string CoinName { get; set; } = null!;
        public decimal CurrentPrice { get; set; }
        public decimal PriceChange24h { get; set; }
        public DateTime AddedAt { get; set; }
    }

    public class FavoriteListResponse
    {
        public Guid UserId { get; set; }
        public int TotalFavorites { get; set; }
        public List<FavoriteResponse> Favorites { get; set; } = new();
        public DateTime LastUpdated { get; set; }
    }
}
