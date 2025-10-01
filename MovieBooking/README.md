# CineBook - Online Movie Booking System

A production-ready, front-end only React application for booking movie tickets. Built with React, TypeScript, and Vite, featuring a complete booking flow from movie selection to seat reservation and checkout.

## 🎯 Features

### Core Functionality
- **Movie Browsing**: Search, filter by genre/date/theatre, sort by popularity or newest
- **Movie Details**: View synopsis, runtime, rating, and available showtimes
- **Seat Selection**: Interactive seat map with visual states (available/booked/locked)
- **Seat Locking**: Reserve seats with expiry timer and partial failure handling
- **Checkout**: Booking summary with mock payment gateway (success/fail toggle)
- **Authentication**: Mock JWT-based auth with login/register
- **Booking History**: View past bookings with printable tickets
- **Admin Panel**: Add/edit/delete movies (in-memory)

### Technical Highlights
- ✅ **Accessibility**: Keyboard navigation, ARIA labels, color contrast compliant
- ✅ **Performance**: Route-level code splitting, lazy image loading, memoized rendering
- ✅ **Responsive**: Mobile-first design with tablet/desktop breakpoints
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Testing**: Unit tests (Vitest) and E2E test scenarios included
- ✅ **Backend Ready**: Easy switch from mock to real API

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

### Default Credentials
```
Email: any@email.com
Password: any password
```

The mock authentication accepts any email/password combination. Use `admin@example.com` to access the admin panel.

## 📁 Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   ├── MovieCard.tsx
│   │   │   ├── SeatGrid.tsx
│   │   │   ├── SeatLegend.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ui/              # Shadcn UI components
│   │   ├── contexts/            # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useSeatSelection.ts
│   │   ├── pages/               # Route pages
│   │   │   ├── Home.tsx
│   │   │   ├── MovieDetail.tsx
│   │   │   ├── SeatSelection.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── Admin.tsx
│   │   ├── services/            # API services
│   │   │   ├── api.ts           # API wrapper
│   │   │   └── mockApi.ts       # Mock API implementation
│   │   ├── types/               # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx              # App root with routing
│   │   └── main.tsx             # Entry point
│   └── index.html
├── tailwind.config.ts           # Tailwind configuration
├── package.json
└── README.md
```

## 🔄 Switching to Real Backend

The application uses a mock API by default. To connect to a real backend:

### 1. Set Environment Variable

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://your-api-server.com/api
```

### 2. API Contract

Your backend must implement the following endpoints:

#### GET /movies
Returns array of movies with shows.

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "synopsis": "string",
    "posterUrl": "string",
    "duration": number,
    "genres": ["string"],
    "rating": number,
    "shows": [...]
  }
]
```

#### GET /movies/:id
Returns single movie with shows.

#### GET /shows/:id
Returns show with seat layout.

**Response:**
```json
{
  "id": "string",
  "movieId": "string",
  "theatre": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "price": number,
  "seatsLayout": [
    {
      "id": "string",
      "row": "string",
      "number": number,
      "state": "available" | "booked" | "locked",
      "price": number
    }
  ]
}
```

#### POST /shows/:id/lock
Locks seats and returns lock token.

**Request:**
```json
{
  "seatIds": ["string"],
  "holdSeconds": number (optional, default: 300)
}
```

**Response:**
```json
{
  "lockToken": "string",
  "lockedSeats": ["string"],
  "failedSeats": ["string"],
  "expiresAt": "ISO-8601 datetime"
}
```

#### POST /bookings
Creates booking with locked seats.

**Request:**
```json
{
  "userId": "string",
  "showId": "string",
  "seatIds": ["string"],
  "lockToken": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "userId": "string",
  "showId": "string",
  "seats": [
    {
      "id": "string",
      "row": "string",
      "number": number,
      "price": number
    }
  ],
  "total": number,
  "createdAt": "ISO-8601 datetime"
}
```

#### GET /bookings?userId=:id
Returns user's bookings.

#### POST /auth/login
Authenticates user.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  },
  "token": "string"
}
```

#### POST /auth/register
Registers new user (same response as login).

### 3. Implementation Details

The `src/services/api.ts` file already contains the logic to switch between mock and real API:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const USE_MOCK_API = !API_BASE_URL;
```

When `VITE_API_BASE_URL` is set, all API calls will use `fetch` to make HTTP requests to your backend. No code changes required!

## 🧪 Testing

### Unit Tests

Run unit tests with Vitest:

```bash
npm test
```

Example test file: `src/hooks/useSeatSelection.test.ts`

### E2E Tests

E2E test scenarios are documented in `src/tests/e2e-booking-flow.md`

To run E2E tests with Cypress:

```bash
# Install Cypress
npm install --save-dev cypress

# Open Cypress
npx cypress open

# Run headless
npx cypress run
```

Or with Playwright:

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run tests
npx playwright test
```

## 🎨 Design System

- **Colors**: Cinematic red primary, dark slate backgrounds, gold accents
- **Typography**: Inter (body), Outfit (display/headings)
- **Components**: Shadcn UI with Radix primitives
- **Styling**: Tailwind CSS with custom design tokens

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px (touch-optimized)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ⚡ Performance Optimizations

1. **Code Splitting**: Each route is lazy-loaded
2. **Image Optimization**: Lazy loading with blur placeholders
3. **Memoization**: Seat grid rendering is memoized for large layouts
4. **Debouncing**: Search input is debounced

## 🔐 Security Notes

- JWT tokens stored in localStorage (switch to httpOnly cookies in production)
- Mock API accepts any credentials (implement proper auth in production)
- No actual payment processing (integrate real payment gateway)

## 🐛 Known Limitations

- In-memory storage (data resets on refresh)
- No real-time seat updates (implement WebSockets for production)
- Mock payment gateway (integrate Stripe/PayPal for production)
- No server-side seat locking validation
- Admin panel has no auth protection beyond email check

## 📦 Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)

---

**Happy Booking! 🎬🍿**
