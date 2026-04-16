using BuyCrypt.Domain.Models;

public class PortfolioAsset
{
    public Guid AssetId { get; private set; }
    public Guid UserId { get; private set; }
    public string CoinId { get; private set; } = null!;
    public string Symbol { get; private set; } = null!;
    public string CoinName { get; private set; } = null!;
    public decimal Quantity { get; private set; }
    public decimal AvgBuyPrice { get; private set; }
    public decimal TotalInvested { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // Navigation Property
    public UserProfile User { get; private set; } = null!;

    // EF Core requires a parameterless constructor
    private PortfolioAsset() { }

    // Your custom constructor for domain logic
    public PortfolioAsset(Guid userId, string coinId, string symbol, string coinName, decimal quantity, decimal buyPrice)
    {
        AssetId = Guid.NewGuid();
        UserId = userId;
        CoinId = coinId;
        Symbol = symbol;
        CoinName = coinName;
        Quantity = quantity;
        AvgBuyPrice = buyPrice;
        TotalInvested = quantity * buyPrice;
        CreatedAt = DateTime.UtcNow;
    }

    public void AddQuantity(decimal qty, decimal invested)
    {
        TotalInvested += invested;
        Quantity += qty;
        AvgBuyPrice = TotalInvested / Quantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveQuantity(decimal qty)
    {
        var proportion = qty / Quantity;
        TotalInvested -= TotalInvested * proportion;
        Quantity -= qty;
        UpdatedAt = DateTime.UtcNow;
    }
}
