// ============================================================
// FILE TO REPLACE:
// BuyCrypt.Api/Program.cs
// ============================================================

using BuyCrypt.Application.Interfaces;
using BuyCrypt.Application.Mapping;
using BuyCrypt.Infrastructure.Data;
using BuyCrypt.Infrastructure.Options;
using BuyCrypt.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ── 1. DATABASE (SQL Server — your existing setup) ────────────
builder.Services.AddDbContext<CryptoDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("dbconn")));

// ── 2. JWT AUTHENTICATION ─────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"]!;
var jwtAudience = builder.Configuration["Jwt:Audience"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(
                                           Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ── 3. AUTOMAPPER ─────────────────────────────────────────────
builder.Services.AddAutoMapper(typeof(UserProfileMapping).Assembly);

// ── 4. COINGECKO HTTP CLIENT ──────────────────────────────────
builder.Services.AddHttpClient<ICryptoMarketService, CryptoMarketService>();
builder.Services.Configure<CoinGeckoOptions>(
    builder.Configuration.GetSection("CoinGecko"));

// ── 5. APPLICATION SERVICES ───────────────────────────────────
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IWalletService, WalletService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<ITradingService, TradingService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IFavoriteService, FavoriteService>();
builder.Services.AddScoped<IJwtService, JwtService>();   // NEW — needed for AuthController

// ── 6. CORS — allow Angular on port 4200 + 8080 ──────────────
builder.Services.AddCors(opt => opt.AddPolicy("AllowAll", p =>
    p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

// ── 7. CONTROLLERS + SWAGGER WITH JWT BUTTON ─────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "BuyCrypt API",
        Version = "v2",
        Description = "Crypto trading simulation — now with JWT authentication"
    });

    // Adds the "Authorize" button to Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Enter: Bearer {your_token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ── MIDDLEWARE (ORDER MATTERS) ────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "BuyCrypt API v2");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowAll");       // 1. CORS first
app.UseAuthentication();       // 2. Verify token
app.UseAuthorization();        // 3. Check permissions
app.MapControllers();          // 4. Route to controller
app.Run();
