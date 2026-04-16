using BuyCrypt.Application.DTOs;

namespace BuyCrypt.Application.Interfaces
{
    public interface ICryptoMarketService
    {
        Task<decimal> GetCurrentPriceAsync(string coinId);
        Task<Dictionary<string, decimal>> GetMultiplePricesAsync(List<string> coinIds);
        Task<Dictionary<string, CoinMarketData>> GetCoinDetailsAsync(List<string> coinIds);

        // NEW METHODS
        Task<List<CoinListItem>> GetTopCoinsAsync(int limit = 100);
        Task<CoinDetailInfo> GetCoinDetailAsync(string coinId);
    }

    public class CoinMarketData
    {
        public string CoinId { get; set; } = null!;
        public decimal CurrentPrice { get; set; }
        public decimal PriceChange24h { get; set; }
        public decimal PriceChangePercentage24h { get; set; }
    }
}
