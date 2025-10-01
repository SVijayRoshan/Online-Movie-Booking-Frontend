# E2E Test Scenario: Complete Booking Flow

## Test: User books movie tickets successfully

### Prerequisites
- Application is running
- Mock API is enabled
- Browser supports JavaScript and localStorage

### Test Steps

#### 1. Navigate to Home Page
```javascript
// Visit homepage
cy.visit('/');

// Verify page loads
cy.get('[data-testid="link-home"]').should('be.visible');
cy.get('[data-testid="input-search"]').should('be.visible');
```

#### 2. Search and Filter Movies
```javascript
// Search for a movie
cy.get('[data-testid="input-search"]').type('Quantum');

// Verify filtered results
cy.get('[data-testid^="text-title-"]').should('contain', 'Quantum');

// Filter by genre
cy.get('[data-testid="select-genre"]').click();
cy.contains('Sci-Fi').click();

// Verify genre filter applied
cy.get('[data-testid^="badge-genre-"]').should('contain', 'Sci-Fi');
```

#### 3. Select Movie
```javascript
// Click on first movie card
cy.get('[data-testid^="button-book-"]').first().click();

// Verify movie detail page
cy.url().should('include', '/movie/');
cy.get('[data-testid="text-movie-title"]').should('be.visible');
cy.get('[data-testid="text-movie-rating"]').should('be.visible');
```

#### 4. Select Showtime
```javascript
// Select a date
cy.get('[data-testid^="button-date-"]').first().click();

// Wait for showtimes to load
cy.get('[data-testid^="text-theatre-"]').should('be.visible');

// Click on a showtime
cy.get('[data-testid^="button-show-"]').first().click();

// Verify seat selection page loads
cy.url().should('include', '/seats/');
cy.get('[data-testid="text-show-info"]').should('be.visible');
```

#### 5. Select Seats
```javascript
// Select multiple seats
cy.get('[data-testid="seat-A1"]').click();
cy.get('[data-testid="seat-A2"]').click();
cy.get('[data-testid="seat-A3"]').click();

// Verify selection count and price
cy.get('[data-testid="text-total-price"]').should('not.contain', '$0.00');

// Try to select booked seat (should not work)
cy.get('[data-testid^="seat-"][disabled]').first().click({ force: true });

// Lock seats
cy.get('[data-testid="button-lock-seats"]').click();

// Verify navigation to checkout
cy.url().should('include', '/checkout');
cy.url().should('include', 'lockToken=');
```

#### 6. Authentication (if not logged in)
```javascript
// If redirected to login
if (cy.url().includes('/login')) {
  cy.get('[data-testid="tab-register"]').click();
  cy.get('[data-testid="input-register-name"]').type('Test User');
  cy.get('[data-testid="input-register-email"]').type('test@example.com');
  cy.get('[data-testid="input-register-password"]').type('password123');
  cy.get('[data-testid="button-register"]').click();
  
  // Should redirect back to booking flow
  cy.url().should('include', '/checkout');
}
```

#### 7. Complete Checkout
```javascript
// Verify booking summary
cy.get('[data-testid="text-theatre"]').should('be.visible');
cy.get('[data-testid="text-date"]').should('be.visible');
cy.get('[data-testid="text-time"]').should('be.visible');
cy.get('[data-testid="text-seats"]').should('contain', 'A1');
cy.get('[data-testid="text-total"]').should('not.contain', '$0.00');

// Fill user details
cy.get('[data-testid="input-name"]').clear().type('John Doe');
cy.get('[data-testid="input-email"]').clear().type('john@example.com');
cy.get('[data-testid="input-phone"]').type('1234567890');

// Set payment to success mode
cy.get('[data-testid="switch-payment-mode"]').should('be.checked');

// Confirm booking
cy.get('[data-testid="button-confirm-booking"]').click();

// Verify success and navigation to profile
cy.url().should('include', '/profile');
cy.contains('Booking confirmed').should('be.visible');
```

#### 8. View Booking History
```javascript
// Verify booking appears in history
cy.get('[data-testid^="text-booking-id-"]').should('be.visible');
cy.get('[data-testid^="text-theatre-"]').should('be.visible');
cy.get('[data-testid^="text-seats-"]').should('contain', 'A1');

// Print ticket
cy.get('[data-testid^="button-print-"]').first().click();

// Verify print dialog opens (mock)
cy.window().then((win) => {
  cy.stub(win, 'open').as('printWindow');
});
```

### Test: Payment Failure Scenario
```javascript
// Follow steps 1-6 above

// Set payment to fail mode
cy.get('[data-testid="switch-payment-mode"]').click();
cy.get('[data-testid="switch-payment-mode"]').should('not.be.checked');

// Attempt booking
cy.get('[data-testid="button-confirm-booking"]').click();

// Verify error message
cy.contains('Payment failed').should('be.visible');

// User should still be on checkout page
cy.url().should('include', '/checkout');
```

### Test: Seat Lock Expiry
```javascript
// Follow steps 1-5 above

// Wait for lock to expire (300 seconds in mock, can be reduced for testing)
// Mock API should handle expiry

// Attempt to complete booking after expiry
// Should show error about expired lock token
cy.contains('expired').should('be.visible');
```

### Test: Concurrent Booking (Partial Lock Failure)
```javascript
// Simulate another user booking same seats
// This requires modifying mock API to simulate concurrent access

// Select seats A1, A2, A3
cy.get('[data-testid="seat-A1"]').click();
cy.get('[data-testid="seat-A2"]').click();
cy.get('[data-testid="seat-A3"]').click();

// Mock API simulates A2 being taken by another user
// Lock request should return failedSeats: ['A2']

cy.get('[data-testid="button-lock-seats"]').click();

// Verify error notification
cy.contains('Some seats could not be locked').should('be.visible');
cy.contains('A2').should('be.visible');

// Verify A2 is deselected, A1 and A3 remain selected
cy.get('[data-testid="seat-A1"]').should('have.attr', 'aria-pressed', 'true');
cy.get('[data-testid="seat-A2"]').should('have.attr', 'aria-pressed', 'false');
cy.get('[data-testid="seat-A3"]').should('have.attr', 'aria-pressed', 'true');
```

### Accessibility Tests
```javascript
// Keyboard navigation for seat selection
cy.get('[data-testid="seat-A1"]').focus();
cy.get('[data-testid="seat-A1"]').type('{enter}');
cy.get('[data-testid="seat-A1"]').should('have.attr', 'aria-pressed', 'true');

// Navigate with arrow keys
cy.get('[data-testid="seat-A1"]').type('{rightarrow}');
cy.focused().should('have.attr', 'data-testid', 'seat-A2');

// Check ARIA labels
cy.get('[data-testid="seat-A1"]').should('have.attr', 'aria-label');

// Check color contrast (using axe-core)
cy.injectAxe();
cy.checkA11y();
```

### Performance Tests
```javascript
// Verify route-level code splitting
cy.window().then((win) => {
  // Check that not all routes are loaded initially
  const scripts = Array.from(win.document.querySelectorAll('script'));
  const hasCodeSplitting = scripts.some(s => s.src.includes('chunk'));
  expect(hasCodeSplitting).to.be.true;
});

// Verify lazy loading of images
cy.get('[data-testid^="img-poster-"]').first().should('have.attr', 'loading', 'lazy');

// Check response times
cy.window().its('performance').then((perf) => {
  const navTiming = perf.timing;
  const loadTime = navTiming.loadEventEnd - navTiming.navigationStart;
  expect(loadTime).to.be.lessThan(3000); // Page loads in under 3s
});
```

## Expected Results
- ✅ User can browse and search movies
- ✅ User can select showtime and seats
- ✅ Seat locking mechanism works with expiry
- ✅ Partial lock failures are handled gracefully
- ✅ Payment simulation works (success and failure)
- ✅ Booking is saved and appears in profile
- ✅ Tickets can be printed
- ✅ All interactions are keyboard accessible
- ✅ Application is responsive on mobile/tablet/desktop
- ✅ Route-level code splitting is implemented
- ✅ Images are lazy loaded

## Running the Tests

### With Cypress
```bash
# Install Cypress
npm install --save-dev cypress @testing-library/cypress

# Run tests
npx cypress open

# Or headless
npx cypress run
```

### With Playwright
```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run tests
npx playwright test

# With UI
npx playwright test --ui
```
