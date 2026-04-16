using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuyCrypt.Domain.Models
{
    public class FavoriteCoin
    {
        public Guid FavoriteId { get; private set; }
        public Guid UserId { get; private set; }
        public string CoinId { get; private set; } = null!;
        public string Symbol { get; private set; } = null!;
        public string CoinName { get; private set; } = null!;
        public DateTime AddedAt { get; private set; }

        // Navigation Property
        public UserProfile User { get; private set; } = null!;
    }
}

