using BuyCrypt.Application.DTOs;

namespace BuyCrypt.Application.Interfaces
{
    public interface IWalletService
    {
        Task<WalletResponse> CreateWalletAsync(CreateWalletRequest request);
        Task<WalletResponse?> GetWalletByUserAsync(Guid userId);
        Task<WalletResponse?> GetWalletAsync(Guid walletId);
        Task<WalletResponse> DepositAsync(WalletTransactionRequest request);
        Task<WalletResponse> WithdrawAsync(WalletTransactionRequest request);
    }
}
