using BuyCrypt.Application.DTOs;
using BuyCrypt.Application.Interfaces;
using BuyCrypt.Domain.Models;
using BuyCrypt.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace BuyCrypt.Infrastructure.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly CryptoDbContext _context;
        private readonly ICryptoMarketService _cryptoService;

        public FavoriteService(CryptoDbContext context, ICryptoMarketService cryptoService)
        {
            _context = context;
            _cryptoService = cryptoService;
        }

        public async Task<FavoriteResponse> AddFavoriteAsync(AddFavoriteRequest request)
        {
            var userExists = await _context.UserProfiles.AnyAsync(u => u.UserId == request.UserId);
            if (!userExists)
                throw new InvalidOperationException("User not found");

            var existing = await _context.FavoriteCoins
                .FirstOrDefaultAsync(f => f.UserId == request.UserId && f.CoinId == request.CoinId);

            if (existing != null)
                throw new InvalidOperationException("Coin already in favorites");

            var favorite = Activator.CreateInstance<FavoriteCoin>();
            SetProperty(favorite, "FavoriteId", Guid.NewGuid());
            SetProperty(favorite, "UserId", request.UserId);
            SetProperty(favorite, "CoinId", request.CoinId);
            SetProperty(favorite, "Symbol", request.Symbol.ToUpper());
            SetProperty(favorite, "CoinName", request.CoinName);
            SetProperty(favorite, "AddedAt", DateTime.UtcNow);

            _context.FavoriteCoins.Add(favorite);
            await _context.SaveChangesAsync();

            // ✅ Add try-catch for market data
            CoinMarketData? coinData = null;
            try
            {
                var marketData = await _cryptoService.GetCoinDetailsAsync(new List<string> { request.CoinId });
                coinData = marketData.ContainsKey(request.CoinId) ? marketData[request.CoinId] : null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching market data for {request.CoinId}: {ex.Message}");
            }

            return new FavoriteResponse
            {
                FavoriteId = favorite.FavoriteId,
                UserId = favorite.UserId,
                CoinId = favorite.CoinId,
                Symbol = favorite.Symbol,
                CoinName = favorite.CoinName,
                CurrentPrice = coinData?.CurrentPrice ?? 0,
                PriceChange24h = coinData?.PriceChange24h ?? 0,
                AddedAt = favorite.AddedAt
            };
        }

        public async Task<FavoriteListResponse> GetUserFavoritesAsync(Guid userId)
        {
            var favorites = await _context.FavoriteCoins
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.AddedAt)
                .ToListAsync();

            if (!favorites.Any())
            {
                return new FavoriteListResponse
                {
                    UserId = userId,
                    TotalFavorites = 0,
                    Favorites = new List<FavoriteResponse>(),
                    LastUpdated = DateTime.UtcNow
                };
            }

            var coinIds = favorites.Select(f => f.CoinId).ToList();

            // ✅ Add try-catch for market data fetching
            Dictionary<string, CoinMarketData> marketData;
            try
            {
                marketData = await _cryptoService.GetCoinDetailsAsync(coinIds);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching market data for favorites: {ex.Message}");
                // Return favorites with zero prices if API fails
                marketData = new Dictionary<string, CoinMarketData>();
            }

            var favoriteResponses = favorites.Select(f =>
            {
                // ✅ Safe null checks
                CoinMarketData? coinData = null;
                if (marketData != null && marketData.ContainsKey(f.CoinId))
                {
                    coinData = marketData[f.CoinId];
                }

                return new FavoriteResponse
                {
                    FavoriteId = f.FavoriteId,
                    UserId = f.UserId,
                    CoinId = f.CoinId,
                    Symbol = f.Symbol,
                    CoinName = f.CoinName,
                    CurrentPrice = coinData?.CurrentPrice ?? 0,
                    PriceChange24h = coinData?.PriceChange24h ?? 0,
                    AddedAt = f.AddedAt
                };
            }).ToList();

            return new FavoriteListResponse
            {
                UserId = userId,
                TotalFavorites = favorites.Count,
                Favorites = favoriteResponses,
                LastUpdated = DateTime.UtcNow
            };
        }

        public async Task<bool> RemoveFavoriteAsync(Guid favoriteId)
        {
            var favorite = await _context.FavoriteCoins.FindAsync(favoriteId);
            if (favorite == null) return false;

            _context.FavoriteCoins.Remove(favorite);
            await _context.SaveChangesAsync();
            return true;
        }

        private void SetProperty(object obj, string name, object value)
        {
            obj.GetType().GetProperty(name, BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance)
                ?.SetValue(obj, value);
        }
    }
}