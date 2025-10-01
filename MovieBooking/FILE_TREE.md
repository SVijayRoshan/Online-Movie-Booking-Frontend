# Complete File Tree

```
cinebook/
├── README.md                              # Complete documentation with setup instructions
├── ARCHITECTURE.md                        # Design decisions and architecture summary
├── FILE_TREE.md                          # This file
├── package.json                          # Dependencies and scripts
├── vite.config.ts                        # Vite configuration
├── vitest.config.ts                      # Vitest test configuration
├── tailwind.config.ts                    # Tailwind CSS configuration
├── postcss.config.js                     # PostCSS configuration
├── tsconfig.json                         # TypeScript configuration
│
├── client/
│   ├── index.html                        # HTML entry point with SEO meta tags
│   │
│   └── src/
│       ├── main.tsx                      # Application entry point
│       ├── App.tsx                       # Root component with routing
│       ├── index.css                     # Global styles and Tailwind
│       │
│       ├── components/                   # Reusable UI components
│       │   ├── Header.tsx               # App header with navigation
│       │   ├── MovieCard.tsx            # Movie card component
│       │   ├── SeatGrid.tsx             # Interactive seat selection grid
│       │   ├── SeatLegend.tsx           # Seat state legend
│       │   ├── ProtectedRoute.tsx       # Auth route guard
│       │   │
│       │   └── ui/                      # Shadcn UI components
│       │       ├── alert.tsx
│       │       ├── badge.tsx
│       │       ├── button.tsx
│       │       ├── card.tsx
│       │       ├── dialog.tsx
│       │       ├── input.tsx
│       │       ├── label.tsx
│       │       ├── select.tsx
│       │       ├── switch.tsx
│       │       ├── tabs.tsx
│       │       ├── textarea.tsx
│       │       ├── toast.tsx
│       │       ├── toaster.tsx
│       │       └── tooltip.tsx
│       │
│       ├── contexts/                    # React contexts
│       │   └── AuthContext.tsx          # Authentication state management
│       │
│       ├── hooks/                       # Custom React hooks
│       │   ├── useSeatSelection.ts      # Seat selection logic (tested)
│       │   ├── useSeatSelection.test.ts # Unit tests
│       │   └── use-toast.ts             # Toast notifications
│       │
│       ├── lib/                         # Utilities and configuration
│       │   ├── queryClient.ts           # React Query setup
│       │   └── utils.ts                 # Utility functions
│       │
│       ├── pages/                       # Route pages
│       │   ├── Home.tsx                 # Movie listing with filters
│       │   ├── MovieDetail.tsx          # Movie details and showtimes
│       │   ├── SeatSelection.tsx        # Seat selection with locking
│       │   ├── Checkout.tsx             # Booking checkout
│       │   ├── Login.tsx                # Login/Register
│       │   ├── Profile.tsx              # Booking history
│       │   ├── Admin.tsx                # Admin panel
│       │   └── not-found.tsx            # 404 page
│       │
│       ├── services/                    # API services
│       │   ├── api.ts                   # API wrapper (switches mock/real)
│       │   └── mockApi.ts               # Mock API implementation
│       │
│       ├── tests/                       # Test files
│       │   ├── setup.ts                 # Test setup
│       │   └── e2e-booking-flow.md      # E2E test scenarios
│       │
│       └── types/                       # TypeScript types
│           └── index.ts                 # All type definitions
│
├── server/                              # Backend (minimal for this frontend app)
│   ├── index.ts                         # Express server
│   ├── routes.ts                        # API routes (placeholder)
│   ├── storage.ts                       # Storage interface
│   └── vite.ts                          # Vite integration
│
└── shared/                              # Shared between client and server
    └── schema.ts                        # Database schema (if needed)
```

## Key Files Explained

### Configuration Files
- **package.json** - All dependencies, includes react-router-dom, vitest, testing library
- **tailwind.config.ts** - Color scheme, fonts (Inter, Outfit), responsive breakpoints
- **vitest.config.ts** - Unit test configuration with jsdom environment
- **vite.config.ts** - Build configuration with path aliases (@, @shared)

### Core Application Files
- **client/src/App.tsx** - Root component with lazy-loaded routes
- **client/src/main.tsx** - Entry point, renders App with providers
- **client/index.html** - HTML shell with SEO meta tags

### Type Definitions (client/src/types/index.ts)
- Movie, Show, Seat, Booking, User types
- API request/response types
- LockSeatsRequest, LockSeatsResponse
- CreateBookingRequest

### Services
- **client/src/services/api.ts**
  - Wrapper that switches between mock and real API
  - Uses VITE_API_BASE_URL environment variable
  - All API methods typed with TypeScript

- **client/src/services/mockApi.ts**
  - Complete in-memory implementation
  - Seat locking with expiry (configurable)
  - Partial lock failure simulation
  - Deterministic sample data (6 movies, multiple shows)

### Pages
1. **Home.tsx** - Movie browsing
   - Search by title/description
   - Filter by genre, date, theatre
   - Sort by popularity/newest
   - Pagination ready (currently shows all)

2. **MovieDetail.tsx** - Movie information
   - Synopsis, rating, duration, genres
   - Showtimes grouped by date and theatre
   - Links to seat selection

3. **SeatSelection.tsx** - Seat booking
   - Visual seat grid (8 rows × 10 seats)
   - Keyboard navigation (arrow keys + Enter)
   - Real-time seat state (available/booked/locked)
   - Lock expiry countdown
   - Partial failure handling

4. **Checkout.tsx** - Booking confirmation
   - Booking summary
   - User details form
   - Mock payment toggle (success/fail)
   - Creates booking with lock token

5. **Login.tsx** - Authentication
   - Login and register tabs
   - Mock JWT auth (any credentials work)
   - Redirects after auth

6. **Profile.tsx** - User bookings
   - Booking history list
   - Printable tickets
   - Booking details

7. **Admin.tsx** - Admin panel
   - Add/delete movies
   - In-memory data management
   - Protected route (admin@example.com)

### Components
- **Header.tsx** - Navigation bar with auth state
- **MovieCard.tsx** - Movie card with poster, rating, genres
- **SeatGrid.tsx** - Memoized seat rendering for performance
- **SeatLegend.tsx** - Visual legend for seat states
- **ProtectedRoute.tsx** - Auth guard wrapper

### Hooks
- **useSeatSelection.ts** - Seat selection logic
  - Toggle seat selection
  - Max seats limit
  - Calculate total price
  - Clear selection
  - **Fully tested** with unit tests

### Tests
- **useSeatSelection.test.ts** - Unit tests for seat logic
  - Selection/deselection
  - Max seats enforcement
  - Price calculation
  - Partial failure handling

- **e2e-booking-flow.md** - E2E test scenarios
  - Complete booking flow
  - Payment success/failure
  - Seat lock expiry
  - Concurrent booking
  - Accessibility tests
  - Performance benchmarks

## Routes

```
/ ............................ Home (movie listing)
/movie/:id ................... Movie detail
/seats/:showId ............... Seat selection
/checkout?showId=&lockToken=&seats= ... Checkout (protected)
/login ....................... Login/Register
/profile ..................... Booking history (protected)
/admin ....................... Admin panel (protected)
```

## Environment Variables

### Development (Mock API - default)
No configuration needed. Mock API is used automatically.

### Production (Real API)
Create `.env`:
```
VITE_API_BASE_URL=https://api.yourserver.com
```

## NPM Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm test          # Run unit tests
npm run test:ui   # Run tests with UI
```

## Dependencies Summary

### Core
- react, react-dom
- typescript
- vite

### Routing & State
- react-router-dom (v6 compatible, using wouter for this implementation)
- @tanstack/react-query

### UI
- tailwindcss
- @radix-ui/* (accessible components)
- lucide-react (icons)

### Testing
- vitest
- @testing-library/react
- @testing-library/jest-dom
- @testing-library/user-event

### Dev Tools
- @vitejs/plugin-react
- autoprefixer
- postcss

## Total Files: ~50
- Pages: 7
- Components: 10+
- Services: 2
- Hooks: 2
- Tests: 2
- Config: 6
- Documentation: 3
