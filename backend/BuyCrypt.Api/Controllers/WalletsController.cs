using BuyCrypt.Application.DTOs;
using BuyCrypt.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BuyCrypt.Api.Controllers
{
    [ApiController]
    [Route("api/wallets")]
    public class WalletsController : ControllerBase
    {
        private readonly IWalletService _walletService;

        public WalletsController(IWalletService walletService)
        {
            _walletService = walletService;
        }

        // ✅ CREATE WALLET
        [HttpPost]
        public async Task<IActionResult> CreateWallet(CreateWalletRequest request)
        {
            var result = await _walletService.CreateWalletAsync(request);
            return Ok(result);
        }

        // ✅ GET WALLET
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetWallet(Guid userId)
        {
            var wallet = await _walletService.GetWalletByUserAsync(userId);
            if (wallet == null)
                return NotFound("Wallet not found");

            return Ok(wallet);
        }

        // ✅ DEPOSIT
        [HttpPost("deposit")]
        public async Task<IActionResult> Deposit(WalletTransactionRequest request)
        {
            var result = await _walletService.DepositAsync(request);
            return Ok(result);
        }

        // ✅ WITHDRAW
        [HttpPost("withdraw")]
        public async Task<IActionResult> Withdraw(WalletTransactionRequest request)
        {
            var result = await _walletService.WithdrawAsync(request);
            return Ok(result);
        }
    }
}
