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
    public class UserProfileMapping : Profile
    {
        public UserProfileMapping()
        {
            CreateMap<CreateUserRequest, UserProfile>()
                .ForMember(d => d.UserId, o => o.MapFrom(_ => Guid.NewGuid()))
                .ForMember(d => d.CreatedAt, o => o.MapFrom(_ => DateTime.UtcNow));

            CreateMap<UserProfile, UserResponse>();
        }
    }
}
