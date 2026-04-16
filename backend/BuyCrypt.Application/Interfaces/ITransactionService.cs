using BuyCrypt.Application.DTOs;

namespace BuyCrypt.Application.Interfaces
{
    public interface ITransactionService
    {
        Task<TransactionResponse?> GetTransactionAsync(Guid transactionId);
        Task<TransactionHistoryResponse> GetUserTransactionsAsync(Guid userId);
        Task<List<TransactionResponse>> GetWalletTransactionsAsync(Guid walletId);
    }
}
