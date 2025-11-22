// src/utils/locationHelpers.ts
// ✅ Helper functions for fuzzy location matching

/**
 * Common location aliases for Costa Rica
 * Maps alternative names to canonical forms
 */
const LOCATION_ALIASES: Record<string, string[]> = {
  'sjo': ['sjo', 'san jose', 'san josé', 'juan santamaria', 'alajuela', 'downtown san jose'],
  'lir': ['lir', 'liberia', 'daniel oduber'],
  'la fortuna': ['fortuna', 'la fortuna', 'arenal', 'el castillo', 'fortuna de san carlos', 'la fortuna de san carlos', 'arenal volcano'],
  'monteverde': ['monteverde', 'monte verde', 'cloud forest'],
  'tamarindo': ['tamarindo', 'flamingo', 'conchal', 'tamarindo beach', 'guanacaste beaches'],
  'manuel antonio': ['manuel antonio', 'quepos', 'quepos-manuel antonio', 'national park area'],
  'puerto viejo': ['puerto viejo', 'puerto viejo de talamanca'],
  'papagayo': ['papagayo', 'gulf of papagayo', 'peninsula papagayo', 'papagayo peninsula'],
  'jaco': ['jaco', 'jacó', 'jaco beach', 'playa hermosa', 'central pacific'],
  'nosara': ['nosara', 'playa nosara', 'playa guiones', 'guiones'],
  'samara': ['samara', 'playa samara'],
  'santa teresa': ['santa teresa', 'mal pais', 'malpais', 'montezuma'],
  'rio celeste': ['rio celeste', 'río celeste', 'celeste', 'tenorio'],
  'dominical': ['dominical', 'beach town'],
  'uvita': ['uvita', 'marino ballena'],
  'coco': ['coco', 'playas del coco', 'hermosa', 'ocotal'],
};

/**
 * Normalizes a location name for fuzzy matching
 * Removes common words like "Airport", parentheses, special chars, and extra spaces
 */
export function normalizeLocationName(name: string): string {
  return name
    .toLowerCase()
    .replace(/airport|aeropuerto|intl|international/gi, '')
    .replace(/beach|playa/gi, '')
    .replace(/hotel|resort/gi, '')
    .replace(/[()]/g, '')
    .replace(/[áàä]/g, 'a')
    .replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i')
    .replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Gets all known aliases for a location
 */
function getLocationAliases(name: string): string[] {
  const normalized = normalizeLocationName(name);

  // Check if this location has known aliases
  for (const [canonical, aliases] of Object.entries(LOCATION_ALIASES)) {
    if (aliases.some(alias => normalized.includes(alias) || alias.includes(normalized))) {
      return aliases;
    }
  }

  return [normalized];
}

/**
 * Checks if two location names match using fuzzy logic
 * Handles:
 * - "SJO" matching "SJO Airport", "San Jose (SJO)", "Juan Santamaría"
 * - "LIR" matching "LIR Airport", "Liberia (LIR)", "Daniel Oduber"
 * - "La Fortuna" matching "Fortuna", "La Fortuna de San Carlos"
 * - And all other common Costa Rica locations
 */
export function matchLocation(location1: string, location2: string): boolean {
  if (!location1 || !location2) return false;

  const norm1 = normalizeLocationName(location1);
  const norm2 = normalizeLocationName(location2);

  // 1. Exact match after normalization
  if (norm1 === norm2) return true;

  // 2. Check if one contains the other (handles partial matches)
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true;

  // 3. Check aliases (handles "SJO" → "San Jose", etc.)
  const aliases1 = getLocationAliases(location1);
  const aliases2 = getLocationAliases(location2);

  for (const alias1 of aliases1) {
    for (const alias2 of aliases2) {
      if (alias1 === alias2) return true;
      if (alias1.includes(alias2) || alias2.includes(alias1)) return true;
    }
  }

  // 4. Check for abbreviation match (3+ chars)
  const words1 = norm1.split(' ');
  const words2 = norm2.split(' ');

  for (const word1 of words1) {
    for (const word2 of words2) {
      if (word1.length >= 3 && word2.length >= 3) {
        if (word1 === word2) return true;
        // Check if one is abbreviation of the other
        if (word1.startsWith(word2) || word2.startsWith(word1)) return true;
      }
    }
  }

  return false;
}
