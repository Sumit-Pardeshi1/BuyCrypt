// ============================================================
// FILE TO ADD (or REPLACE if exists):
// BuyCrypt.Api/Controllers/AuthController.cs
// ============================================================

using BCrypt.Net;
using BuyCrypt.Application.DTOs;
using BuyCrypt.Application.Interfaces;
using BuyCrypt.Domain.Models;
using BuyCrypt.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace BuyCrypt.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly CryptoDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthController(CryptoDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        // POST /api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Normalize email to lowercase
            var email = request.Email.ToLowerInvariant().Trim();

            // Check if email already exists
            if (await _context.UserProfiles.AnyAsync(u => u.Email == email))
                return Conflict(new { message = "An account with this email already exists." });

            // Hash password with BCrypt (12 rounds)
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12);

            // Create user
            var user = Activator.CreateInstance<UserProfile>();
            SetProp(user, "UserId", Guid.NewGuid());
            SetProp(user, "FullName", request.FullName.Trim());
            SetProp(user, "Email", email);
            SetProp(user, "PhoneNumber", request.PhoneNumber);
            SetProp(user, "PasswordHash", passwordHash);
            SetProp(user, "PreferredCurrency", "INR");
            SetProp(user, "CreatedAt", DateTime.UtcNow);

            _context.UserProfiles.Add(user);

            // Create wallet automatically (balance starts at 0)
            var wallet = new Wallet(user.UserId, "INR");
            _context.Wallets.Add(wallet);

            await _context.SaveChangesAsync();

            // Generate JWT token so user is immediately logged in
            var token = _jwtService.GenerateToken(user.UserId, user.Email, user.FullName);

            return StatusCode(201, new AuthResponse
            {
                Token = token,
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                WalletId = wallet.WalletId,
                WalletBalance = 0,
                Message = $"Welcome to BuyCrypt, {user.FullName}!"
            });
        }

        // POST /api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var email = request.Email.ToLowerInvariant().Trim();

            // Find user by email
            var user = await _context.UserProfiles
                .FirstOrDefaultAsync(u => u.Email == email);

            // Generic error message (don't reveal if email exists)
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password." });

            // Get stored BCrypt hash
            var storedHash = user.GetType()
                .GetProperty("PasswordHash",
                    BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance)
                ?.GetValue(user)?.ToString();

            // User registered via old system (no password set)
            if (string.IsNullOrEmpty(storedHash))
                return Unauthorized(new
                {
                    message = "This account was created with the old system. Please register a new account."
                });

            // Verify BCrypt password
            if (!BCrypt.Net.BCrypt.Verify(request.Password, storedHash))
                return Unauthorized(new { message = "Invalid email or password." });

            // Get wallet
            var wallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.UserId == user.UserId);

            // Generate fresh JWT token
            var token = _jwtService.GenerateToken(user.UserId, user.Email, user.FullName);

            return Ok(new AuthResponse
            {
                Token = token,
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                WalletId = wallet?.WalletId ?? Guid.Empty,
                WalletBalance = wallet?.Balance ?? 0,
                Message = $"Welcome back, {user.FullName}!"
            });
        }

        // Helper: set private/protected property via reflection
        private static void SetProp(object obj, string name, object? value) =>
            obj.GetType()
               .GetProperty(name,
                   BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance)
               ?.SetValue(obj, value);
    }
}
