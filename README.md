# 🪙 BuyCrypt — Cryptocurrency Trading Simulator

> A full-stack cryptocurrency trading simulation platform built with **Angular** (frontend) and **.NET 8 Web API** (backend).

![Backend](https://img.shields.io/badge/.NET-8.0-purple)
![Frontend](https://img.shields.io/badge/Angular-21-red)
![DB](https://img.shields.io/badge/MySQL-8.0-orange)

---

## 📁 Repository Structure

```
BuyCrypt/
├── backend/                     ← .NET 8 Web API (Clean Architecture)
│   ├── BuyCrypt.Api/            (Controllers, Program.cs)
│   ├── BuyCrypt.Application/    (DTOs, Interfaces, Mapping)
│   ├── BuyCrypt.Domain/         (Models / Entities)
│   └── BuyCrypt.Infrastructure/ (EF Core, Services, JWT)
│
└── frontend/                    ← Angular 21 SPA
    └── src/
        ├── app/core/            (Guards, Interceptors, Services, Layout)
        └── app/features/        (Auth, Dashboard, Market, Trading, Wallet…)
```

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Authentication | JWT-based Register / Login |
| 💰 Wallet | Deposit, Withdraw, Balance tracking |
| 📈 Live Market | Real-time prices via CoinGecko API |
| 🛒 Trading | Buy & Sell cryptocurrency simulation |
| 📊 Portfolio | Charts & Holdings breakdown |
| ⭐ Favourites | Save favourite coins |
| 📜 Transactions | Full transaction history |
| 📱 Mobile-ready | Capacitor support for Android |

---

## 🚀 Quick Start

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [MySQL 8+](https://dev.mysql.com/downloads/)
- Angular CLI — `npm install -g @angular/cli`

### 1. Clone the repo
```bash
git clone https://github.com/Sumit-Pardeshi1/BuyCrypt.git
cd BuyCrypt
```

### 2. Start the Backend
```bash
cd backend
dotnet restore
dotnet ef database update --project BuyCrypt.Infrastructure --startup-project BuyCrypt.Api
dotnet run --project BuyCrypt.Api
```

### 3. Start the Frontend
```bash
cd frontend
npm install
ng serve
```

Open **http://localhost:4200** in your browser.

---

## 🛠 Tech Stack

### Backend
- .NET 8 Web API · C#
- Entity Framework Core · MySQL (Pomelo)
- AutoMapper · JWT Bearer Auth
- Clean Architecture (Api / Application / Domain / Infrastructure)

### Frontend
- Angular 21 · TypeScript · SCSS
- Glassmorphism Design System
- CoinGecko Public API · Chart.js
- Capacitor (Android)

---

## 📄 License
MIT © 2024 Sumit Pardeshi
