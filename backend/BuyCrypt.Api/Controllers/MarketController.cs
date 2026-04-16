using BuyCrypt.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BuyCrypt.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MarketController : ControllerBase
    {
        private readonly ICryptoMarketService _marketService;

        public MarketController(ICryptoMarketService marketService)
        {
            _marketService = marketService;
        }

        [HttpGet("top-coins")]
        public async Task<IActionResult> GetTopCoins([FromQuery] int limit = 100)
        {
            var coins = await _marketService.GetTopCoinsAsync(limit);
            return Ok(coins);
        }

        [HttpGet("coin/{coinId}")]
        public async Task<IActionResult> GetCoinDetail(string coinId)
        {
            try
            {
                var coin = await _marketService.GetCoinDetailAsync(coinId);
                return Ok(coin);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}