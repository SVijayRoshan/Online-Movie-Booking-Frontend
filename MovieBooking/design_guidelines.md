# Design Guidelines: Online Movie Booking Platform

## Core Design Principles

**Cinema-Inspired UI** - Modern movie booking experience inspired by platforms like BookMyShow and Fandango, with Netflix-style movie cards and clean Airbnb-like layouts.

**Key Principles:**
- 🎬 **Cinematic immersion** through rich imagery while maintaining usability
- 🎯 **Clear visual hierarchy** for critical booking actions  
- 📱 **Mobile-first responsive** design with touch-optimized interactions
- ♿ **Accessibility-focused** with keyboard navigation and ARIA labels

---

## Visual Identity

### Color Scheme
**Dark Mode Primary** (matches cinema ambiance)
- Background: Dark slate (`slate-900`)
- Primary: Cinematic red (`red-600`) for CTAs
- Accent: Gold (`amber-500`) for ratings/highlights
- Success: Green for available seats
- Warning: Amber for locked seats

### Typography
- **Headings**: Inter (clean, modern)
- **Body**: Inter (readable)
- **Movie Titles**: Outfit (slightly theatrical)

### Seat Color Coding
- 🟢 **Available**: Green
- 🔴 **Selected**: Red (primary)
- 🟡 **Locked**: Amber (warning)
- ⚫ **Booked**: Gray (disabled)

---

## Layout Patterns

### Responsive Grid System
- **Mobile**: Single column, touch-optimized (min 44px targets)
- **Tablet**: 2-3 columns
- **Desktop**: 4-5 columns with hover effects

### Key UI Components
- **Movie Cards**: 2:3 aspect ratio, hover scale effect
- **Seat Grid**: Clear row labels (A-Z), visual states
- **Navigation**: Sticky header with backdrop blur
- **CTAs**: Large, prominent red buttons

---

## Page Layout Guidelines

### Home Page
- Hero section with search bar
- Movie grid with filtering sidebar (desktop) / drawer (mobile)
- Applied filters as removable chips

### Movie Detail
- Full-width backdrop with gradient overlay
- Poster + details layout
- Showtimes grouped by date and theater

### Seat Selection
- Screen indicator at top
- Zoomable seat grid (mobile)
- Sticky bottom bar with selection summary
- Timer countdown for lock expiry

### Checkout
- Two-column (desktop) / stacked (mobile)
- Booking summary + user details form
- Mock payment toggle for testing

---

## Accessibility Standards

- ✅ **Keyboard Navigation**: All elements accessible via keyboard
- ✅ **ARIA Labels**: Descriptive labels for seat states, forms
- ✅ **Color Contrast**: WCAG 2.1 AA compliant (4.5:1 minimum)
- ✅ **Focus Indicators**: Clear visual focus states
- ✅ **Screen Readers**: Semantic HTML with proper roles

---

## Implementation Notes

- Uses **Tailwind CSS** for styling
- **Shadcn UI** components for accessibility
- **Lucide React** for icons
- **Dark mode** as primary theme
- **Responsive** breakpoints: mobile (`<768px`), tablet (`768-1024px`), desktop (`>1024px`)
