# Design Guidelines: Online Movie Booking Platform

## Design Approach

**Reference-Based Design** inspired by modern cinema booking platforms (BookMyShow, Fandango) combined with entertainment-focused experiences (Netflix for movie cards, Airbnb for clean layouts). This approach balances visual richness with functional clarity, creating an immersive yet efficient booking experience.

**Core Principles:**
- Cinematic immersion through imagery while maintaining usability
- Clear visual hierarchy for critical booking actions
- Trust-building through professional, polished interfaces
- Mobile-first responsive design with touch-optimized interactions

---

## Color Palette

### Dark Mode (Primary)
- **Background Base:** 217 33% 8% (deep slate)
- **Surface Elevated:** 217 30% 12% (card backgrounds)
- **Primary Brand:** 10 90% 58% (cinematic red for CTAs)
- **Accent Gold:** 45 100% 65% (premium highlights, ratings)
- **Success:** 142 71% 45% (booking confirmations)
- **Text Primary:** 0 0% 98%
- **Text Secondary:** 217 15% 70%

### Light Mode (Secondary)
- **Background:** 0 0% 98%
- **Surface:** 0 0% 100%
- **Primary:** 10 85% 55%
- **Text Primary:** 217 33% 15%

**Semantic Colors:**
- Seat Available: 142 71% 45% (success green)
- Seat Booked: 217 20% 40% (muted gray)
- Seat Locked: 38 92% 50% (warning amber)
- Seat Selected: 10 90% 58% (primary red)

---

## Typography

**Font Families:**
- **Headings:** Inter (600-700 weights) - clean, modern
- **Body:** Inter (400-500 weights)
- **Accent/Display:** Outfit (600 weight) for movie titles - slightly more theatrical

**Scale:**
- Hero Title: text-5xl md:text-6xl lg:text-7xl
- Page Heading: text-3xl md:text-4xl
- Section Title: text-2xl md:text-3xl
- Card Title: text-xl md:text-2xl
- Body: text-base
- Caption: text-sm
- Small: text-xs

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 to p-8
- Section spacing: py-12 md:py-20 lg:py-24
- Grid gaps: gap-4 to gap-8

**Container Strategy:**
- Full-width hero: w-full
- Content container: max-w-7xl mx-auto px-4
- Reading content: max-w-4xl
- Forms: max-w-md

**Grid Patterns:**
- Movie cards: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
- Feature sections: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Booking summary: Single column on mobile, 2-column on desktop

---

## Component Library

### Navigation
- Sticky header with backdrop blur (backdrop-blur-lg bg-slate-900/80)
- Logo left, auth buttons right
- Mobile: Hamburger menu with slide-out drawer
- Search bar integrated in header on desktop, separate on mobile

### Movie Cards
- Aspect ratio 2:3 (movie poster standard)
- Hover effect: subtle scale (hover:scale-105) and shadow elevation
- Overlay gradient on poster with title and rating
- Quick action: "Book Now" button on hover (desktop)

### Seat Selection Grid
- Visual grid with clear row labels (A-Z)
- Seat buttons: rounded-lg with 4 distinct states (colors above)
- Legend component showing seat states
- Selected seats counter and total price sticky at bottom on mobile
- Keyboard navigation indicators on focus

### Buttons
**Primary CTA:** bg-red-600 hover:bg-red-700 rounded-lg px-6 py-3 text-white font-semibold
**Secondary:** border-2 border-slate-600 hover:border-slate-400 rounded-lg px-6 py-3
**Outline on Images:** backdrop-blur-md bg-white/10 border border-white/20 rounded-lg px-6 py-3

### Forms
- Floating labels or clear label-above pattern
- Dark backgrounds: bg-slate-800 with border-slate-600
- Focus state: ring-2 ring-red-500
- Error state: border-red-500 with text-red-400 message

### Modals/Dialogs
- Backdrop: bg-black/60 backdrop-blur-sm
- Content: bg-slate-900 rounded-2xl max-w-2xl
- Close button: top-right with hover state

---

## Page-Specific Designs

### Home Page
**Hero Section (60vh):**
- Large background: Cinematic collage or featured movie backdrop with gradient overlay
- Centered content: "Book Your Next Movie Experience"
- Prominent search bar: Theater/Location, Movie, Date pickers
- Trending movies carousel below search

**Movie Listings:**
- Filter sidebar (desktop) / drawer (mobile): Genre chips, Date range, Theater dropdown, Sort options
- Grid of movie cards with infinite scroll
- Applied filters shown as removable chips above grid

### Movie Detail Page
**Hero (50vh):**
- Full-width backdrop image with dark gradient overlay
- Left: Movie poster (fixed aspect)
- Right: Title, rating (with stars), runtime, genres, synopsis
- Primary CTA: "Select Showtime" button (large, red)

**Showtimes Section:**
- Grouped by date (horizontal date selector/tabs)
- Within each date, grouped by theater
- Each showtime as a pill button with time and price
- "Select Seats" action on click

### Seat Selection Page
**Layout:**
- Screen indicator at top: "SCREEN" with curved line
- Seat grid in center with zoom controls (mobile)
- Sticky bottom bar: Selected seats count, total price, "Lock Seats" CTA
- Side panel (desktop) / drawer (mobile): Seat legend, booking timer (countdown)

### Checkout Page
**Two-column (desktop) / stacked (mobile):**
- Left: Booking summary card (movie, show, seats, price breakdown)
- Right: User details form + Payment toggle
- Mock payment: Success/Fail toggle switch for testing
- Confirm button at bottom

### Profile/Booking History
- Timeline-style booking list (most recent first)
- Each booking card: Movie poster thumbnail, show details, seats, "View Ticket" action
- Ticket view: Printable format with QR code placeholder

### Admin Panel
- Table view for movies and shows
- Add/Edit forms in modal dialogs
- Delete confirmations
- Simple, functional design (less cinematic, more utility-focused)

---

## Images

**Hero Images:**
- Home page: Yes - cinematic collage of popular movies or theater interior (1920x800px)
- Movie detail: Yes - movie backdrop/banner (1920x600px)
- Other pages: No hero images

**Movie Posters:**
- Required throughout: Card thumbnails, detail page, booking summary, history
- Aspect ratio: 2:3 (standard movie poster)
- Lazy loading with blur placeholder
- Fallback: Gradient with movie title

**Theater/Amenities Icons:**
- Use Heroicons for: search, filter, user, calendar, clock, ticket, location
- Custom: Seat icons (different states), screen indicator

---

## Responsive Breakpoints

**Mobile (<768px):**
- Single column layouts
- Bottom sheet for filters/seat selection
- Touch-optimized seat buttons (min 44px tap target)
- Sticky CTAs at bottom

**Tablet (768px-1024px):**
- 2-3 column movie grids
- Side-by-side booking summary and form
- Sidebar filters

**Desktop (>1024px):**
- 4-5 column movie grids
- Hover interactions active
- Sidebar navigation for admin
- Multi-column layouts for content

---

## Accessibility & Polish

- All interactive elements keyboard navigable
- Focus indicators: ring-2 ring-red-500 on all focusable elements
- ARIA labels for seat states, loading states, booking timer
- Color contrast: Minimum 4.5:1 for text
- Loading spinners for async actions
- Toast notifications for success/error (top-right position)
- Smooth transitions: transition-all duration-200 (use sparingly)

**Critical:** Maintain dark mode across all form inputs, dropdowns, and text fields with consistent bg-slate-800 backgrounds.