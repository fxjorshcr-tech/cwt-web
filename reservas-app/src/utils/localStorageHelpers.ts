// src/utils/localStorageHelpers.ts
// ✅ Pure functions for localStorage operations
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

/**
 * Load a booking from localStorage
 * @param bookingId - The booking ID (without 'booking_' prefix)
 * @returns The booking data or null if not found
 */
export function loadBookingFromLocalStorage(bookingId: string): LocalStorageBooking | null {
  try {
    const localDataStr = localStorage.getItem(`booking_${bookingId}`);

    if (!localDataStr) {
      return null;
    }

    const localData: LocalStorageBooking = JSON.parse(localDataStr);
    return localData;
  } catch (error) {
    console.error('Error loading booking from localStorage:', error);
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
  try {
    const localDataStr = localStorage.getItem(`booking_${bookingId}`);

    if (!localDataStr) {
      console.error('Booking not found in localStorage');
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
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Remove a booking from localStorage
 * @param bookingId - The booking ID (without 'booking_' prefix)
 */
export function removeBookingFromLocalStorage(bookingId: string): void {
  try {
    localStorage.removeItem(`booking_${bookingId}`);
  } catch (error) {
    console.error('Error removing booking from localStorage:', error);
  }
}

/**
 * Check if a booking exists in localStorage
 * @param bookingId - The booking ID (without 'booking_' prefix)
 * @returns true if the booking exists, false otherwise
 */
export function bookingExistsInLocalStorage(bookingId: string): boolean {
  try {
    return localStorage.getItem(`booking_${bookingId}`) !== null;
  } catch (error) {
    console.error('Error checking booking existence:', error);
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
