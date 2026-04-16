# 🔧 BuyCrypt Backend — .NET 8 Web API

A RESTful Web API built with **Clean Architecture** providing all backend services for the BuyCrypt crypto trading simulator.

---

## 🏗 Project Structure

```
BuyCrypt.Api/               → Entry point — Controllers, Program.cs, appsettings
BuyCrypt.Application/       → DTOs · Interfaces · AutoMapper Profiles
BuyCrypt.Domain/            → Domain models / Entities (no external dependencies)
BuyCrypt.Infrastructure/    → EF Core DbContext · Services · JWT · CoinGecko
```

---

## 📡 API Endpoints

| Controller | Method | Route | Description |
|---|---|---|---|
| AuthController | POST | `/api/auth/register` | Register new user |
| AuthController | POST | `/api/auth/login` | Login & receive JWT |
| WalletsController | GET | `/api/wallets` | Get wallet balance |
| WalletsController | POST | `/api/wallets/deposit` | Deposit funds |
| WalletsController | POST | `/api/wallets/withdraw` | Withdraw funds |
| TradingController | POST | `/api/trading/buy` | Buy cryptocurrency |
| TradingController | POST | `/api/trading/sell` | Sell cryptocurrency |
| MarketController | GET | `/api/market` | Live market data |
| MarketController | GET | `/api/market/{id}` | Single coin detail |
| TransactionsController | GET | `/api/transactions` | Transaction history |
| FavoritesController | GET | `/api/favorites` | Get favourite coins |
| FavoritesController | POST | `/api/favorites` | Add to favourites |
| FavoritesController | DELETE | `/api/favorites/{id}` | Remove favourite |
| DashboardController | GET | `/api/dashboard` | Portfolio summary |
| UsersController | GET | `/api/users/profile` | Get user profile |
| UsersController | PUT | `/api/users/profile` | Update profile |

---

## ⚙️ Setup

### 1. Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [MySQL 8+](https://dev.mysql.com/downloads/)

### 2. Configure `appsettings.json`

Edit `BuyCrypt.Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=BuyCryptDb;User=root;Password=YOUR_PASSWORD;"
  },
  "JwtSettings": {
    "Secret": "YOUR_SUPER_SECRET_KEY_MINIMUM_32_CHARS",
    "Issuer": "BuyCryptApi",
    "Audience": "BuyCryptClient",
    "ExpiryMinutes": 60
  },
  "CoinGecko": {
    "BaseUrl": "https://api.coingecko.com/api/v3"
  }
}
```

### 3. Run Migrations & Start

```bash
# From the backend/ folder:
dotnet restore

dotnet ef database update \
  --project BuyCrypt.Infrastructure \
  --startup-project BuyCrypt.Api

dotnet run --project BuyCrypt.Api
```

API will be available at `http://localhost:5000` (or the port shown in the terminal).

---

## 🔐 Authentication

All protected routes require a JWT Bearer token:
```
Authorization: Bearer <token>
```
Obtain the token from `POST /api/auth/login`.

---

## 📦 Key NuGet Packages

| Package | Purpose |
|---|---|
| Microsoft.EntityFrameworkCore | ORM |
| Pomelo.EntityFrameworkCore.MySql | MySQL provider |
| AutoMapper | DTO ↔ Entity mapping |
| Microsoft.AspNetCore.Authentication.JwtBearer | JWT auth |
| BCrypt.Net-Next | Password hashing |

---

## 📄 License
MIT © 2024 Sumit Pardeshi
