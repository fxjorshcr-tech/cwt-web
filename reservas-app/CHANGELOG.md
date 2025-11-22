# Changelog - Bug Fixes & Improvements

## [Unreleased] - 2025-01-22

### 🐛 Critical Bug Fixes

#### UX & Navigation
- **Fixed scroll issue on booking-details**: Added `useEffect` to scroll to top when switching between trips on mobile
- **Updated summary page title**: Changed from "Review Your Booking" to "Booking Summary" for clarity
- **Fixed booking form loading issues**: Added 10s timeout and exponential retry logic (3 attempts) for Supabase route fetching

#### Responsive Design - Mobile
- **Reduced logo size on mobile**: Logo now 160px (was 256px) on mobile devices, preventing content overlap
  - Mobile: `w-40 h-10` (160px × 40px)
  - Tablet: `sm:w-52 sm:h-14` (208px × 56px)
  - Desktop: `md:w-64 md:h-16` → `lg:w-80 lg:h-20`

- **Fixed hero section padding**: Added `pt-20 sm:pt-0` to prevent navbar overlap on mobile
  - Applied to: private-tours/page.tsx, private-tours/[tourId]/page.tsx

- **Improved badge responsiveness**:
  - Reduced badge text size on mobile (`text-xs sm:text-sm`)
  - Added truncation for long texts (`truncate max-w-[120px] sm:max-w-none`)
  - Shortened "LOCAL OPERATOR • LA FORTUNA" to "📍 LA FORTUNA" on mobile
  - Made all badges smaller and more compact on mobile devices

#### Data Handling & Stability
- **Implemented fuzzy location matching**: Fixed critical bug where routes weren't loading from /shuttle pages
  - Created `locationHelpers.ts` with `normalizeLocationName()` and `matchLocation()`
  - Now handles "SJO" matching "SJO Airport", "San Jose (SJO)", etc.
  - Applied to BookingForm.tsx route selection logic

- **Added Supabase retry logic**: Prevents booking loss on network failures
  - Summary page: 3 retry attempts with exponential backoff (2s, 4s, 8s)
  - Displays retry status to user with toast notifications
  - Critical for ensuring bookings are saved even with poor connectivity

- **Fixed hydration mismatch in CartContext**:
  - Added validation for localStorage data before parsing
  - Returns 0 for itemCount/totalAmount until hydrated
  - Automatically clears corrupted localStorage data
  - Prevents React hydration warnings

### 📝 Files Modified

#### New Files
- `/utils/locationHelpers.ts` - Location fuzzy matching utilities

#### Modified Files
- `/app/booking-details/page.tsx` - Scroll fix
- `/app/summary/page.tsx` - Title + retry logic
- `/components/forms/BookingForm.tsx` - Timeout, retry, fuzzy matching
- `/components/booking/BookingNavbar.tsx` - Logo size
- `/app/private-tours/page.tsx` - Hero padding + badges
- `/app/private-tours/[tourId]/page.tsx` - Hero padding + responsive badges
- `/contexts/CartContext.tsx` - Hydration fix + validation

### 🧪 Testing Recommendations
- Test booking flow from /shuttle pages with fuzzy location names
- Test on mobile devices (320px, 375px, 414px viewports)
- Test network failures during booking submission
- Test cart functionality on page refresh

### 📊 Metrics
- **Bugs Fixed**: 11/24 (46%)
- **Files Modified**: 8
- **Lines Changed**: ~250
- **New Utilities**: 1

---

## Notes

This is an interim commit with critical bug fixes. Additional improvements planned:
- Remaining hero section responsive fixes (contact, about, travel-guide)
- Additional localStorage cleanup with TTL
- Error boundary components
- E2E testing for booking flow
