# 🎨 BuyCrypt Frontend — Angular 21 SPA

A modern, glassmorphism-styled single-page application for the BuyCrypt cryptocurrency trading simulator.

---

## 📁 Project Structure

```
src/
└── app/
    ├── core/
    │   ├── guards/           → AuthGuard (protected route navigation)
    │   ├── interceptors/     → API interceptor (auto-attaches JWT token)
    │   ├── services/         → AuthService, ApiService
    │   ├── models/           → TypeScript interfaces & types
    │   └── layout/           → Header, Footer, Sidebar, MainLayout
    │
    └── features/
        ├── auth/             → Login & Register pages
        ├── dashboard/        → Portfolio summary, holdings, charts
        ├── market/           → Coin list & Coin detail
        ├── trading/          → Buy crypto & Sell crypto
        ├── wallet/           → Deposit, Withdraw, Wallet overview
        ├── transactions/     → Transaction history & detail
        └── favorites/        → Saved favourite coins
```

---

## ✨ Key Features

- 🌑 **Dark Glassmorphism UI** — premium modern design
- 📊 **Portfolio Chart** — visualize holdings with Chart.js
- 🔴🟢 **Live Prices** — CoinGecko public API
- 🔐 **JWT Auth** — auto-attached via HTTP interceptor
- 🛡 **Route Guards** — protected pages for logged-in users only
- 📱 **Mobile-ready** — Capacitor for Android APK builds

---

## ⚙️ Setup

### 1. Prerequisites
- [Node.js 20+](https://nodejs.org/)
- Angular CLI: `npm install -g @angular/cli`

### 2. Install dependencies
```bash
cd frontend
npm install
```

### 3. Configure API URL

Edit `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'   // ← change to your backend URL
};
```

### 4. Start dev server
```bash
ng serve
```

Open **http://localhost:4200** in your browser.

---

## 🏗 Production Build
```bash
ng build --configuration production
# Output → dist/
```

---

## 📱 Android Build (Capacitor)
```bash
ng build
npx cap sync
npx cap open android
# Then build & run from Android Studio
```

---

## 🔑 Environment Files

| File | Used For |
|---|---|
| `src/environments/environment.ts` | Local development |
| `src/environments/environment.prod.ts` | Production build |

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `@angular/core` ~21 | Core framework |
| `chart.js` | Portfolio charts |
| `@capacitor/core` | Mobile (Android/iOS) |
| `rxjs` | Reactive streams |

---

## 📄 License
MIT © 2024 Sumit Pardeshi
