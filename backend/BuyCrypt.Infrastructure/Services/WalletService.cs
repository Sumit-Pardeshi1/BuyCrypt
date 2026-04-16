using AutoMapper;
using BuyCrypt.Application.DTOs;
using BuyCrypt.Application.Interfaces;
using BuyCrypt.Domain.Models;
using BuyCrypt.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BuyCrypt.Infrastructure.Services
{
    public class WalletService : IWalletService
    {
        private readonly CryptoDbContext _context;
        private readonly IMapper _mapper;

        public WalletService(CryptoDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //  CREATE WALLET (ONLY ONE PER USER)
        public async Task<WalletResponse> CreateWalletAsync(CreateWalletRequest request)
        {
            var userExists = await _context.UserProfiles
                .AnyAsync(u => u.UserId == request.UserId);

            if (!userExists)
                throw new InvalidOperationException("User not found");

            var walletExists = await _context.Wallets
                .AnyAsync(w => w.UserId == request.UserId);

            if (walletExists)
                throw new InvalidOperationException("User already has a wallet");

            var wallet = new Wallet(request.UserId, request.Currency);

            _context.Wallets.Add(wallet);
            await _context.SaveChangesAsync();

            return _mapper.Map<WalletResponse>(wallet);
        }

        //  GET WALLET BY USER
        public async Task<WalletResponse?> GetWalletByUserAsync(Guid userId)
        {
            var wallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.UserId == userId);

            return wallet == null ? null : _mapper.Map<WalletResponse>(wallet);
        }

        //  GET WALLET BY ID
        public async Task<WalletResponse?> GetWalletAsync(Guid walletId)
        {
            var wallet = await _context.Wallets.FindAsync(walletId);
            return wallet == null ? null : _mapper.Map<WalletResponse>(wallet);
        }

        //  DEPOSIT MONEY
        public async Task<WalletResponse> DepositAsync(WalletTransactionRequest request)
        {
            var wallet = await _context.Wallets.FindAsync(request.WalletId);
            if (wallet == null)
                throw new InvalidOperationException("Wallet not found");

            wallet.Deposit(request.Amount);

            await _context.SaveChangesAsync();
            return _mapper.Map<WalletResponse>(wallet);
        }

        //  WITHDRAW MONEY
        public async Task<WalletResponse> WithdrawAsync(WalletTransactionRequest request)
        {
            var wallet = await _context.Wallets.FindAsync(request.WalletId);
            if (wallet == null)
                throw new InvalidOperationException("Wallet not found");

            wallet.Withdraw(request.Amount);

            await _context.SaveChangesAsync();
            return _mapper.Map<WalletResponse>(wallet);
        }
    }
}
