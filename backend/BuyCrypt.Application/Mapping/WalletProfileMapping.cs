using AutoMapper;
using BuyCrypt.Application.DTOs;
using BuyCrypt.Domain.Models;

namespace BuyCrypt.Application.Mapping
{
    public class WalletProfileMapping : Profile
    {
        public WalletProfileMapping()
        {
            // ONLY Entity → DTO
            CreateMap<Wallet, WalletResponse>();
        }
    }
}
