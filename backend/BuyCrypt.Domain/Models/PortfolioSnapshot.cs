using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuyCrypt.Domain.Models
{
    public class PortfolioSnapshot
    {
        public Guid SnapshotId { get; private set; }
        public Guid UserId { get; private set; }
        public decimal TotalInvested { get; private set; }
        public decimal CurrentValue { get; private set; }
        public decimal ProfitLoss { get; private set; }
        public decimal ProfitLossPercentage { get; private set; }
        public DateTime SnapshotDate { get; private set; }
        public DateTime CreatedAt { get; private set; }

        // Navigation Property
        public UserProfile User { get; private set; } = null!;
    }
}
