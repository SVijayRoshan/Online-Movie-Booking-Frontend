# 🎬 Online Movie Booking System (Frontend)

This project is a **production-grade, front-end-only movie ticket booking system** built with **React, TypeScript, Vite, Tailwind CSS, and React Router**.  

It replicates the core experience of popular online booking platforms:
- Browse movies with search, filters, and sorting
- View movie details and available showtimes
- Interactive seat selection with real-time seat locking simulation
- Checkout flow with mock payment and booking confirmation
- Authentication (login/register) and protected routes
- Profile with booking history and printable tickets
- Minimal admin dashboard to manage movies and shows

### 🔧 Tech Stack
- **React + Vite + TypeScript** — fast, modern frontend stack
- **Tailwind CSS** — responsive, utility-first styling
- **React Router v6** — routing and navigation
- **Mock API layer** — simulates backend endpoints (seat locking, bookings, auth)
- **Context API** — lightweight state management
- **Optional**: easily swappable to a real backend via `src/services/api.ts`

### 🚀 Features
- Fully responsive (mobile, tablet, desktop)
- Accessible seat selection (keyboard + screen reader friendly)
- Optimized performance with lazy loading & route-level code splitting
- Clear separation of UI, logic, and API layer for easy testing and backend integration

### 📂 Structure
- `src/pages` — app routes (Home, Movie Detail, Seat Selection, Checkout, Login, Profile, Admin)
- `src/components` — reusable UI elements (Header, MovieCard, SeatMap, etc.)
- `src/services` — mock API & API wrapper
- `src/context` — authentication provider
- `src/types` — shared TypeScript models

### 🛠️ How to Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev

