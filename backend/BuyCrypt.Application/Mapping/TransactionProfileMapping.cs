using AutoMapper;
using BuyCrypt.Application.DTOs;
using BuyCrypt.Domain.Models;

namespace BuyCrypt.Application.Mapping
{
    public class TransactionProfileMapping : Profile
    {
        public TransactionProfileMapping()
        {
            CreateMap<Transaction, TransactionResponse>();
        }
    }
}
