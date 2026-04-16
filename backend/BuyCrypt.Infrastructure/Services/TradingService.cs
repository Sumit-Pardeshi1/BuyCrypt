using BuyCrypt.Application.DTOs;
using BuyCrypt.Application.Interfaces;
using BuyCrypt.Domain.Models;
using BuyCrypt.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BuyCrypt.Infrastructure.Services
{
    public class TradingService : ITradingService
    {
        private readonly CryptoDbContext _context;
        private readonly ICryptoMarketService _cryptoService;

        private const decimal FeePercentage = 0.01m; // 1%

        public TradingService(
            CryptoDbContext context,
            ICryptoMarketService cryptoService)
        {
            _context = context;
            _cryptoService = cryptoService;
        }

        // ========================= BUY =========================
        public async Task<TradeResponse> BuyAssetAsync(BuyAssetRequest request)
        {
            var wallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.UserId == request.UserId);

            if (wallet == null)
                throw new InvalidOperationException("Wallet not found");

            var currentPrice = await _cryptoService.GetCurrentPriceAsync(request.CoinId);
            if (currentPrice <= 0)
                throw new InvalidOperationException("Unable to fetch current price");

            var totalAmount = request.Quantity * currentPrice;
            var fees = totalAmount * FeePercentage;
            var totalCost = totalAmount + fees;

            wallet.Withdraw(totalCost); //  domain logic

            // -------- Transaction --------
            var transaction = new Transaction(
                request.UserId,
                wallet.WalletId,
                request.CoinId,
                request.Symbol.ToUpper(),
                "BUY",
                request.Quantity,
                currentPrice,
                totalAmount,
                fees,
                request.Notes
            );

            _context.Transactions.Add(transaction);

            // -------- Portfolio Asset --------
            var asset = await _context.PortfolioAssets
                .FirstOrDefaultAsync(a =>
                    a.UserId == request.UserId &&
                    a.CoinId == request.CoinId);

            if (asset == null)
            {
                asset = new PortfolioAsset(
                    request.UserId,
                    request.CoinId,
                    request.Symbol.ToUpper(),
                    request.CoinName,   
                    request.Quantity,
                    currentPrice
                );

                _context.PortfolioAssets.Add(asset);
            }
            else
            {
                asset.AddQuantity(request.Quantity, totalAmount);
            }

            await _context.SaveChangesAsync();

            return new TradeResponse
            {
                TransactionId = transaction.TransactionId,
                TransactionType = "BUY",
                CoinId = request.CoinId,
                Symbol = request.Symbol,
                Quantity = request.Quantity,
                PricePerCoin = currentPrice,
                TotalAmount = totalAmount,
                Fees = fees,
                NewWalletBalance = wallet.Balance,
                TransactionDate = transaction.TransactionDate,
                Message = "Buy order executed successfully"
            };
        }

        // ========================= SELL =========================
        public async Task<TradeResponse> SellAssetAsync(SellAssetRequest request)
        {
            var wallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.UserId == request.UserId);

            if (wallet == null)
                throw new InvalidOperationException("Wallet not found");

            var asset = await _context.PortfolioAssets
                .FirstOrDefaultAsync(a =>
                    a.UserId == request.UserId &&
                    a.CoinId == request.CoinId);

            if (asset == null || asset.Quantity < request.Quantity)
                throw new InvalidOperationException("Insufficient asset quantity");

            var currentPrice = await _cryptoService.GetCurrentPriceAsync(request.CoinId);
            if (currentPrice <= 0)
                throw new InvalidOperationException("Unable to fetch current price");

            var totalAmount = request.Quantity * currentPrice;
            var fees = totalAmount * FeePercentage;
            var netAmount = totalAmount - fees;

            wallet.Deposit(netAmount); //  domain logic

            // -------- Transaction --------
            var transaction = new Transaction(
                request.UserId,
                wallet.WalletId,
                request.CoinId,
                asset.Symbol,
                "SELL",
                request.Quantity,
                currentPrice,
                totalAmount,
                fees,
                request.Notes
            );

            _context.Transactions.Add(transaction);

            // -------- Portfolio update --------
            asset.RemoveQuantity(request.Quantity);

            if (asset.Quantity == 0)
                _context.PortfolioAssets.Remove(asset);

            await _context.SaveChangesAsync();

            return new TradeResponse
            {
                TransactionId = transaction.TransactionId,
                TransactionType = "SELL",
                CoinId = request.CoinId,
                Symbol = asset.Symbol,
                Quantity = request.Quantity,
                PricePerCoin = currentPrice,
                TotalAmount = totalAmount,
                Fees = fees,
                NewWalletBalance = wallet.Balance,
                TransactionDate = transaction.TransactionDate,
                Message = "Sell order executed successfully"
            };
        }
    }
}
