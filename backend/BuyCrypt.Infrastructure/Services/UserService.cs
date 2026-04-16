using AutoMapper;
using BuyCrypt.Application.DTOs;
using BuyCrypt.Application.Interfaces;
using BuyCrypt.Domain.Models;
using BuyCrypt.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace BuyCrypt.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly CryptoDbContext _context;
        private readonly IMapper _mapper;

        public UserService(CryptoDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<UserResponse> CreateUserAsync(CreateUserRequest request)
        {
            if (await _context.UserProfiles.AnyAsync(u => u.Email == request.Email))
                throw new InvalidOperationException("Email already exists");

            var user = _mapper.Map<UserProfile>(request);

            _context.UserProfiles.Add(user);
            await _context.SaveChangesAsync();

            return _mapper.Map<UserResponse>(user);
        }

        public async Task<UserResponse?> GetUserAsync(Guid userId)
        {
            var user = await _context.UserProfiles.FindAsync(userId);
            return user == null ? null : _mapper.Map<UserResponse>(user);
        }

        public async Task<UserResponse?> UpdateUserAsync(Guid userId, UpdateUserRequest request)
        {
            var user = await _context.UserProfiles.FindAsync(userId);
            if (user == null) return null;

            if (!string.IsNullOrWhiteSpace(request.FullName))
                SetProperty(user, "FullName", request.FullName);
            if (!string.IsNullOrWhiteSpace(request.Email))
                SetProperty(user, "Email", request.Email);
            if (request.PhoneNumber != null)
                SetProperty(user, "PhoneNumber", request.PhoneNumber);
            if (!string.IsNullOrWhiteSpace(request.PreferredCurrency))
                SetProperty(user, "PreferredCurrency", request.PreferredCurrency);

            SetProperty(user, "UpdatedAt", DateTime.UtcNow);
            await _context.SaveChangesAsync();

            return MapToResponse(user);
        }

        public async Task<bool> DeleteUserAsync(Guid userId)
        {
            var user = await _context.UserProfiles.FindAsync(userId);
            if (user == null) return false;

            _context.UserProfiles.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        private void SetProperty(object obj, string name, object value)
        {
            obj.GetType().GetProperty(name, BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance)
                ?.SetValue(obj, value);
        }

        private UserResponse MapToResponse(UserProfile user) => new()
        {
            UserId = user.UserId,
            FullName = user.FullName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            PreferredCurrency = user.PreferredCurrency,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };

        public async Task<UserResponse?> GetUserByEmailAsync(string email)
        {
            var user = await _context.UserProfiles
                .FirstOrDefaultAsync(u => u.Email == email);

            return user == null ? null : _mapper.Map<UserResponse>(user);
        }
    }
}
