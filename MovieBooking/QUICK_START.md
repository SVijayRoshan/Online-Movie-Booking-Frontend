# 🚀 Quick Start - Movie Booking App

## Get Running in 2 Minutes

### Prerequisites
- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **Terminal/Command line** access

### 0️⃣ Navigate to Project
```bash
# Open terminal and go to the project folder
cd Online-Movie-Booking-Frontend-main/MovieBooking
```

### 1️⃣ Install & Run
```bash
npm install && npm run dev
```

### 2️⃣ Open Browser
**URL:** http://localhost:5000

### 3️⃣ Login
**Email:** any@email.com  
**Password:** anypassword

---

## 📋 Essential Commands
```bash
npm run dev      # Start development
npm run build    # Build for production
npm run check    # Type checking
```

---

## 🧪 Test Features

### Normal User Flow:
1. Browse movies on home page
2. Click movie → Select showtime
3. Choose seats → Fill checkout form
4. Toggle payment success/fail
5. View booking in profile

### Admin Features:
- **Email:** admin@example.com
- **Password:** anything
- Add/edit/delete movies

---

## 🔧 Quick Fixes

**Port busy?**
```bash
lsof -ti:5000 | xargs kill -9
```

**TypeScript errors?**
```bash
npm run check
```

**Build failing?**
```bash
rm -rf node_modules && npm install
```

---

## 📁 Key Files
- `client/src/services/mockApi.ts` - Sample data
- `client/src/pages/` - All page components
- `.env` - Add VITE_API_BASE_URL for real backend

---

**✅ That's it! Check INSTRUCTIONS.md for complete details.**