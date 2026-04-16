using BuyCrypt.Application.DTOs;
using BuyCrypt.Application.Interfaces;
using BuyCrypt.Domain.Models;
using BuyCrypt.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

public class DashboardService : IDashboardService
{
    private readonly CryptoDbContext _context;
    private readonly ICryptoMarketService _cryptoService;

    public DashboardService(CryptoDbContext context, ICryptoMarketService cryptoService)
    {
        _context = context;
        _cryptoService = cryptoService;
    }

    public async Task<DashboardResponse?> GetDashboardAsync(Guid userId)
    {
        var user = await _context.UserProfiles.FindAsync(userId);
        if (user == null) return null;

        var wallets = await _context.Wallets
            .Where(w => w.UserId == userId)
            .ToListAsync();

        var assets = await _context.PortfolioAssets
            .Where(a => a.UserId == userId)
            .ToListAsync();

        var totalTransactions = await _context.Transactions
            .CountAsync(t => t.UserId == userId);

        var walletBalance = wallets.Sum(w => w.Balance);

        if (!assets.Any())
        {
            return new DashboardResponse
            {
                UserId = userId,
                FullName = user.FullName,
                TotalInvested = 0,
                CurrentValue = 0,
                TotalProfitLoss = 0,
                ProfitLossPercentage = 0,
                NetWorth = walletBalance,  
                AvailableCash = walletBalance,  
                InvestedPercentage = 0,  
                TotalWalletBalance = walletBalance,
                TotalAssets = 0,
                TotalTransactions = totalTransactions,
                Holdings = new(),
                Wallets = wallets.Select(MapWallet).ToList(),
                LastUpdated = DateTime.UtcNow
            };
        }

        var coinIds = assets.Select(a => a.CoinId).Distinct().ToList();
        var prices = await _cryptoService.GetMultiplePricesAsync(coinIds);

        decimal totalInvested = assets.Sum(a => a.TotalInvested);
        decimal totalCurrentValue = 0;

        var holdings = new List<AssetHoldingResponse>();

        foreach (var asset in assets)
        {
            var currentPrice = prices.TryGetValue(asset.CoinId, out var price) ? price : 0;
            var currentValue = asset.Quantity * currentPrice;
            var profitLoss = currentValue - asset.TotalInvested;
            var profitLossPercentage = asset.TotalInvested > 0
                ? (profitLoss / asset.TotalInvested) * 100
                : 0;

            totalCurrentValue += currentValue;

            holdings.Add(new AssetHoldingResponse
            {
                AssetId = asset.AssetId,  
                CoinId = asset.CoinId,
                Symbol = asset.Symbol,
                CoinName = asset.CoinName,
                Quantity = asset.Quantity,
                AvgBuyPrice = asset.AvgBuyPrice,
                CurrentPrice = currentPrice,
                InvestedValue = asset.TotalInvested,
                CurrentValue = currentValue,
                ProfitLoss = profitLoss,
                ProfitLossPercentage = profitLossPercentage
            });
        }

        foreach (var holding in holdings)
        {
            holding.PortfolioWeightage = totalCurrentValue > 0
                ? (holding.CurrentValue / totalCurrentValue) * 100
                : 0;
        }

        var totalPL = totalCurrentValue - totalInvested;
        var totalPLPercentage = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

        
        var netWorth = walletBalance + totalCurrentValue;
        var investedPercentage = netWorth > 0 ? (totalCurrentValue / netWorth) * 100 : 0;

        return new DashboardResponse
        {
            UserId = userId,
            FullName = user.FullName,
            TotalInvested = totalInvested,
            CurrentValue = totalCurrentValue,
            TotalProfitLoss = totalPL,
            ProfitLossPercentage = totalPLPercentage,
            NetWorth = netWorth,  
            AvailableCash = walletBalance, 
            InvestedPercentage = investedPercentage,  
            TotalWalletBalance = walletBalance,
            TotalAssets = assets.Count,
            TotalTransactions = totalTransactions,
            Holdings = holdings.OrderByDescending(h => h.CurrentValue).ToList(),
            Wallets = wallets.Select(MapWallet).ToList(),
            LastUpdated = DateTime.UtcNow
        };
    }

    private static WalletSummary MapWallet(Wallet w) => new()
    {
        WalletId = w.WalletId,
        Balance = w.Balance,
        Currency = w.Currency
    };
}
