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

### Screenshot's
<img width="910" height="686" alt="Screenshot 2026-04-03 160852" src="https://github.com/user-attachments/assets/14558448-8e70-4eb1-9b53-1f6f25c7b968" />
<img width="636" height="726" alt="Screenshot 2026-04-03 191404" src="https://github.com/user-attachments/assets/da08eeeb-29f8-4ae9-9c70-e5d8efaa847a" />
<img width="1919" height="909" alt="Screenshot 2026-04-03 191431" src="https://github.com/user-attachments/assets/54c8306b-dccc-4bdc-9af9-7e1ee09659a6" />
<img width="1545" height="913" alt="Screenshot 2026-04-03 191448" src="https://github.com/user-attachments/assets/c097efd4-67b1-4139-add7-f6f2b4d25a34" />
<img width="1553" height="883" alt="Screenshot 2026-04-03 191510" src="https://github.com/user-attachments/assets/039f799f-b706-4691-aa94-a1c069d75127" />
<img width="1556" height="907" alt="Screenshot 2026-04-03 191525" src="https://github.com/user-attachments/assets/53006a5b-f9e5-4eb5-9889-ec041665d198" />
<img width="1566" height="908" alt="Screenshot 2026-04-03 191542 (1)" src="https://github.com/user-attachments/assets/474943f1-3b6f-4c6e-b070-543deabaca0f" />
<img width="1566" height="908" alt="Screenshot 2026-04-03 191542" src="https://github.com/user-attachments/assets/095946d1-dc46-4eb7-aa4c-85544532ba8d" />
<img width="1564" height="907" alt="Screenshot 2026-04-03 191556" src="https://github.com/user-attachments/assets/8788bcac-2a9a-43ba-bbf6-8fdfab2eaf0e" />
<img width="1563" height="910" alt="Screenshot 2026-04-03 191609" src="https://github.com/user-attachments/assets/9b17cb24-6305-40b3-a72f-66bfe95bfdac" />
<img width="1556" height="911" alt="Screenshot 2026-04-03 191630" src="https://github.com/user-attachments/assets/0a70015e-51fd-470f-bd63-69debe470bca" />
<img width="1562" height="905" alt="Screenshot 2026-04-03 191646" src="https://github.com/user-attachments/assets/6d0c50e2-3f17-43d8-b122-8caeb1426f69" />
<img width="354" height="907" alt="Screenshot 2026-04-03 191658" src="https://github.com/user-attachments/assets/767fab1e-f390-4269-9c2d-5e727bd57714" />
<img width="1536" height="912" alt="Screenshot 2026-04-03 191724" src="https://github.com/user-attachments/assets/fc3d0830-2591-4896-b91c-b83a31aeff6f" />

---

## 📄 License
© 2024 Sumit Pardeshi
