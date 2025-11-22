// src/utils/locationHelpers.ts
// ✅ Helper functions for fuzzy location matching

/**
 * Normalizes a location name for fuzzy matching
 * Removes common words like "Airport", parentheses, and extra spaces
 */
export function normalizeLocationName(name: string): string {
  return name
    .toLowerCase()
    .replace(/airport|aeropuerto|intl|international/gi, '')
    .replace(/[()]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Checks if two location names match using fuzzy logic
 * Handles cases like "SJO" matching "SJO Airport" or "San Jose (SJO)"
 */
export function matchLocation(location1: string, location2: string): boolean {
  const norm1 = normalizeLocationName(location1);
  const norm2 = normalizeLocationName(location2);

  // Exact match after normalization
  if (norm1 === norm2) return true;

  // Check if one contains the other
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true;

  // Check for common abbreviations
  const abbrev1 = norm1.split(' ')[0]; // First word
  const abbrev2 = norm2.split(' ')[0];

  if (abbrev1 === abbrev2 && abbrev1.length >= 3) return true;

  return false;
}
