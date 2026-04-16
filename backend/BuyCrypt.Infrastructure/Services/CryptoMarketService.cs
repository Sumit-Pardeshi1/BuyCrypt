using BuyCrypt.Application.DTOs;
using BuyCrypt.Application.Interfaces;
using BuyCrypt.Infrastructure.Options;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace BuyCrypt.Infrastructure.Services
{
    public class CryptoMarketService : ICryptoMarketService
    {
        private readonly HttpClient _httpClient;
        private readonly CoinGeckoOptions _options;

        public CryptoMarketService(
            HttpClient httpClient,
            IOptions<CoinGeckoOptions> options)
        {
            _httpClient = httpClient;
            _options = options.Value;

            _httpClient.BaseAddress = new Uri(_options.BaseUrl);

            if (!string.IsNullOrEmpty(_options.ApiKey))
            {
                _httpClient.DefaultRequestHeaders.Add(
                    "x-cg-demo-api-key", _options.ApiKey);
            }
        }

        // ✅ SINGLE PRICE
        public async Task<decimal> GetCurrentPriceAsync(string coinId)
        {
            var response = await _httpClient.GetAsync(
                $"simple/price?ids={coinId}&vs_currencies=inr");

            if (!response.IsSuccessStatusCode)
                return 0;

            using var stream = await response.Content.ReadAsStreamAsync();
            using var doc = await JsonDocument.ParseAsync(stream);

            if (doc.RootElement.TryGetProperty(coinId, out var coin) &&
                coin.TryGetProperty("inr", out var price))
            {
                return price.GetDecimal();
            }

            return 0;
        }

        // ✅ MULTIPLE PRICES
        public async Task<Dictionary<string, decimal>> GetMultiplePricesAsync(List<string> coinIds)
        {
            var result = new Dictionary<string, decimal>();
            if (!coinIds.Any()) return result;

            var ids = string.Join(",", coinIds);

            var response = await _httpClient.GetAsync(
                $"simple/price?ids={ids}&vs_currencies=inr");

            if (!response.IsSuccessStatusCode)
                return result;

            using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

            foreach (var coinId in coinIds)
            {
                if (doc.RootElement.TryGetProperty(coinId, out var coin) &&
                    coin.TryGetProperty("inr", out var price))
                {
                    result[coinId] = price.GetDecimal();
                }
                else
                {
                    result[coinId] = 0;
                }
            }

            return result;
        }

        // ✅ DASHBOARD / FAVORITES
        public async Task<Dictionary<string, CoinMarketData>> GetCoinDetailsAsync(List<string> coinIds)
        {
            var result = new Dictionary<string, CoinMarketData>();
            if (!coinIds.Any()) return result;

            var ids = string.Join(",", coinIds);

            var response = await _httpClient.GetAsync(
                $"simple/price?ids={ids}&vs_currencies=inr&include_24hr_change=true");

            if (!response.IsSuccessStatusCode)
                return result;

            using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());

            foreach (var coinId in coinIds)
            {
                if (doc.RootElement.TryGetProperty(coinId, out var coin))
                {
                    var price = coin.GetProperty("inr").GetDecimal();
                    var change = coin.GetProperty("inr_24h_change").GetDecimal();

                    result[coinId] = new CoinMarketData
                    {
                        CoinId = coinId,
                        CurrentPrice = price,
                        PriceChange24h = change,
                        PriceChangePercentage24h = change
                    };
                }
            }

            return result;
        }

        // Add these methods to existing CryptoMarketService class

        public async Task<List<CoinListItem>> GetTopCoinsAsync(int limit = 100)
        {
            var response = await _httpClient.GetAsync(
                $"coins/markets?vs_currency=inr&order=market_cap_desc&per_page={limit}&page=1&sparkline=false&price_change_percentage=24h");

            if (!response.IsSuccessStatusCode)
                return new List<CoinListItem>();

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            var coins = new List<CoinListItem>();

            foreach (var item in doc.RootElement.EnumerateArray())
            {
                try
                {
                    // Helper method to safely get decimal values
                    decimal GetDecimalOrZero(JsonElement element, string propertyName)
                    {
                        if (element.TryGetProperty(propertyName, out var prop) &&
                            prop.ValueKind == JsonValueKind.Number)
                        {
                            return prop.GetDecimal();
                        }
                        return 0m;
                    }

                    // Helper method to safely get string values
                    string GetStringOrEmpty(JsonElement element, string propertyName)
                    {
                        if (element.TryGetProperty(propertyName, out var prop) &&
                            prop.ValueKind == JsonValueKind.String)
                        {
                            return prop.GetString() ?? "";
                        }
                        return "";
                    }

                    coins.Add(new CoinListItem
                    {
                        Id = GetStringOrEmpty(item, "id"),
                        Symbol = GetStringOrEmpty(item, "symbol").ToUpper(),
                        Name = GetStringOrEmpty(item, "name"),
                        CurrentPrice = GetDecimalOrZero(item, "current_price"),
                        PriceChange24h = GetDecimalOrZero(item, "price_change_percentage_24h"),
                        MarketCap = GetDecimalOrZero(item, "market_cap"),
                        Image = GetStringOrEmpty(item, "image")
                    });
                }
                catch (Exception ex)
                {
                    // Log and skip this coin if there's an error
                    Console.WriteLine($"Error parsing coin: {ex.Message}");
                    continue;
                }
            }

            return coins;
        }
        public async Task<CoinDetailInfo> GetCoinDetailAsync(string coinId)
        {
            var response = await _httpClient.GetAsync(
                $"coins/{coinId}?localization=false&tickers=false&community_data=false&developer_data=false");

            if (!response.IsSuccessStatusCode)
                throw new Exception("Unable to fetch coin details");

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            var marketData = doc.RootElement.GetProperty("market_data");

            // Helper method to safely get decimal values
            decimal GetDecimalOrZero(JsonElement element, string propertyName)
            {
                if (element.TryGetProperty(propertyName, out var prop))
                {
                    if (prop.ValueKind == JsonValueKind.Object && prop.TryGetProperty("inr", out var inrProp))
                    {
                        if (inrProp.ValueKind == JsonValueKind.Number)
                            return inrProp.GetDecimal();
                    }
                    else if (prop.ValueKind == JsonValueKind.Number)
                    {
                        return prop.GetDecimal();
                    }
                }
                return 0m;
            }

            string GetStringOrEmpty(JsonElement element, string propertyName)
            {
                if (element.TryGetProperty(propertyName, out var prop) &&
                    prop.ValueKind == JsonValueKind.String)
                {
                    return prop.GetString() ?? "";
                }
                return "";
            }

            return new CoinDetailInfo
            {
                Id = GetStringOrEmpty(doc.RootElement, "id"),
                Symbol = GetStringOrEmpty(doc.RootElement, "symbol").ToUpper(),
                Name = GetStringOrEmpty(doc.RootElement, "name"),
                CurrentPrice = GetDecimalOrZero(marketData, "current_price"),
                PriceChange24h = GetDecimalOrZero(marketData, "price_change_percentage_24h"),
                PriceChangePercentage24h = GetDecimalOrZero(marketData, "price_change_percentage_24h"),
                High24h = GetDecimalOrZero(marketData, "high_24h"),
                Low24h = GetDecimalOrZero(marketData, "low_24h"),
                MarketCap = GetDecimalOrZero(marketData, "market_cap"),
                Image = doc.RootElement.TryGetProperty("image", out var imgElement) &&
                        imgElement.TryGetProperty("large", out var largeProp) &&
                        largeProp.ValueKind == JsonValueKind.String
                        ? largeProp.GetString() ?? ""
                        : ""
            };
        }
    }
}
