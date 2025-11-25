// src/utils/localStorageHelpers.ts
// ✅ CORREGIDO: Manejo robusto de localStorage para evitar errores críticos
// NO state management - just data transformation and storage

export interface LocalStorageTrip {
  from_location: string;
  to_location: string;
  date: string;
  adults: number;
  children: number;
  price: number;
  duration: string;
  routeId?: number;
  calculatedPrice: number;
}

export interface LocalStorageTripDetails {
  pickup_address: string;
  dropoff_address: string;
  pickup_time: string;
  flight_number: string;
  airline: string;
  special_requests: string;
  children_ages: (number | null)[];
  add_ons: string[];
  night_surcharge: number;
  add_ons_price: number;
  final_price: number;
}

export interface LocalStorageBooking {
  bookingId: string;
  trips: LocalStorageTrip[];
  createdAt: string;
  tripDetails?: LocalStorageTripDetails[];
}

// ============================================
// STORAGE AVAILABILITY CHECK
// ============================================

/**
 * ✅ Check if localStorage is available and working
 * Safari private mode and some corporate browsers disable localStorage
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const testKey = '__booking_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load a booking from localStorage
 * @param bookingId - The booking ID (without 'booking_' prefix)
 * @returns The booking data or null if not found
 */
export function loadBookingFromLocalStorage(bookingId: string): LocalStorageBooking | null {
  // ✅ Check if localStorage is available
  if (!isLocalStorageAvailable()) {
    console.warn('[Booking] localStorage not available');
    return null;
  }

  try {
    const localDataStr = localStorage.getItem(`booking_${bookingId}`);

    if (!localDataStr) {
      return null;
    }

    const localData = JSON.parse(localDataStr);

    // ✅ Validate the structure of the data
    if (!localData || typeof localData !== 'object') {
      console.warn('[Booking] Invalid booking data structure');
      return null;
    }

    if (!localData.bookingId || !Array.isArray(localData.trips)) {
      console.warn('[Booking] Missing required fields in booking data');
      return null;
    }

    return localData as LocalStorageBooking;
  } catch (error) {
    console.error('[Booking] Error loading from localStorage:', error);
    return null;
  }
}

/**
 * Save trip details to an existing booking in localStorage
 * @param bookingId - The booking ID (without 'booking_' prefix)
 * @param tripIndex - The index of the trip to update
 * @param tripDetails - The trip details to save
 * @returns true if successful, false otherwise
 */
export function saveBookingDetailsToLocalStorage(
  bookingId: string,
  tripIndex: number,
  tripDetails: LocalStorageTripDetails
): boolean {
  // ✅ Check if localStorage is available
  if (!isLocalStorageAvailable()) {
    console.warn('[Booking] localStorage not available for saving');
    return false;
  }

  try {
    const localDataStr = localStorage.getItem(`booking_${bookingId}`);

    if (!localDataStr) {
      console.warn('[Booking] Booking not found in localStorage');
      return false;
    }

    const localData: LocalStorageBooking = JSON.parse(localDataStr);

    // Initialize tripDetails array if it doesn't exist
    if (!localData.tripDetails) {
      localData.tripDetails = [];
    }

    // Update the trip details for the specified index
    localData.tripDetails[tripIndex] = tripDetails;

    // Save back to localStorage
    localStorage.setItem(`booking_${bookingId}`, JSON.stringify(localData));

    return true;
  } catch (error) {
    console.error('[Booking] Error saving to localStorage:', error);
    return false;
  }
}

/**
 * ✅ Save a new booking to localStorage
 * @param bookingId - The booking ID (without 'booking_' prefix)
 * @param bookingData - The booking data to save
 * @returns true if successful, false otherwise
 */
export function saveBookingToLocalStorage(
  bookingId: string,
  bookingData: Omit<LocalStorageBooking, 'bookingId'>
): boolean {
  // ✅ Check if localStorage is available
  if (!isLocalStorageAvailable()) {
    console.warn('[Booking] localStorage not available for saving');
    return false;
  }

  try {
    const dataToSave: LocalStorageBooking = {
      bookingId,
      ...bookingData,
    };

    localStorage.setItem(`booking_${bookingId}`, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    // Handle QuotaExceededError
    console.error('[Booking] Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Remove a booking from localStorage
 * @param bookingId - The booking ID (without 'booking_' prefix)
 */
export function removeBookingFromLocalStorage(bookingId: string): void {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.removeItem(`booking_${bookingId}`);
  } catch (error) {
    console.error('[Booking] Error removing from localStorage:', error);
  }
}

/**
 * Check if a booking exists in localStorage
 * @param bookingId - The booking ID (without 'booking_' prefix)
 * @returns true if the booking exists, false otherwise
 */
export function bookingExistsInLocalStorage(bookingId: string): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    return localStorage.getItem(`booking_${bookingId}`) !== null;
  } catch (error) {
    console.error('[Booking] Error checking booking existence:', error);
    return false;
  }
}

/**
 * Filter null values from children ages array
 * @param ages - Array of ages that may contain null values
 * @returns Filtered array with only number values, or null if all null
 */
export function filterChildrenAges(ages: (number | null)[] | null): number[] | null {
  if (!ages || ages.length === 0) return null;

  const filtered = ages.filter((age): age is number => age !== null);
  return filtered.length > 0 ? filtered : null;
}
