using AutoMapper;
using BuyCrypt.Application.DTOs;
using BuyCrypt.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuyCrypt.Application.Mapping
{
    public class FavoriteProfileMapping : Profile
    {
        public FavoriteProfileMapping()
        {
            CreateMap<FavoriteCoin, FavoriteResponse>();
        }
    }
}
