using BuyCrypt.Application.DTOs;
using BuyCrypt.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BuyCrypt.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TradingController : ControllerBase
    {
        private readonly ITradingService _tradingService;

        public TradingController(ITradingService tradingService)
        {
            _tradingService = tradingService;
        }

        [HttpPost("buy")]
        public async Task<IActionResult> BuyAsset([FromBody] BuyAssetRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _tradingService.BuyAssetAsync(request);
            return Ok(result);
        }

        [HttpPost("sell")]
        public async Task<IActionResult> SellAsset([FromBody] SellAssetRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _tradingService.SellAssetAsync(request);
            return Ok(result);
        }
    }
}
