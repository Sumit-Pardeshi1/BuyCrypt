using BuyCrypt.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BuyCrypt.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionsController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpGet("{transactionId}")]
        public async Task<IActionResult> GetTransaction(Guid transactionId)
        {
            var transaction = await _transactionService.GetTransactionAsync(transactionId);
            if (transaction == null)
                return NotFound(new { message = "Transaction not found" });

            return Ok(transaction);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserTransactions(Guid userId)
        {
            var history = await _transactionService.GetUserTransactionsAsync(userId);
            return Ok(history);
        }

        [HttpGet("wallet/{walletId}")]
        public async Task<IActionResult> GetWalletTransactions(Guid walletId)
        {
            var transactions = await _transactionService.GetWalletTransactionsAsync(walletId);
            return Ok(transactions);
        }
    }
}
