// src/utils/localStorage-cleanup.ts
// ✅ Utility to clean old bookings from localStorage

const TTL_HOURS = 24; // 24 hours
const BOOKING_PREFIX = 'booking_';

// Store interval ID to prevent memory leaks
let cleanupIntervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Cleans old bookings from localStorage
 * Removes bookings older than TTL_HOURS
 */
export function cleanOldBookings(): void {
  if (typeof window === 'undefined') return;

  try {
    const now = Date.now();
    const keysToRemove: string[] = [];

    // Iterate through localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(BOOKING_PREFIX)) continue;

      try {
        const data = localStorage.getItem(key);
        if (!data) continue;

        const parsed = JSON.parse(data);

        // Check if has createdAt field
        if (parsed.createdAt) {
          const createdAt = new Date(parsed.createdAt).getTime();
          const ageHours = (now - createdAt) / (1000 * 60 * 60);

          // Mark for removal if older than TTL
          if (ageHours > TTL_HOURS) {
            keysToRemove.push(key);
          }
        }
      } catch (err) {
        // If parsing fails, mark for removal
        keysToRemove.push(key);
      }
    }

    // Remove old bookings
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('[Cleanup] Error cleaning localStorage:', error);
  }
}

/**
 * Initializes localStorage cleanup
 * Call this on app startup
 * Returns a cleanup function to stop the interval
 */
export function initLocalStorageCleanup(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Clear any existing interval to prevent duplicates
  if (cleanupIntervalId !== null) {
    clearInterval(cleanupIntervalId);
  }

  // Run immediately
  cleanOldBookings();

  // Run every hour
  cleanupIntervalId = setInterval(cleanOldBookings, 60 * 60 * 1000);

  // Return cleanup function
  return () => {
    if (cleanupIntervalId !== null) {
      clearInterval(cleanupIntervalId);
      cleanupIntervalId = null;
    }
  };
}
