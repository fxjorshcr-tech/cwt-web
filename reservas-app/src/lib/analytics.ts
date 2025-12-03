// src/lib/analytics.ts
// Google Analytics 4 event tracking helpers

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Initialize dataLayer if it doesn't exist
 */
function ensureDataLayer(): void {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
}

/**
 * Check if we're in browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Track a custom event in GA4
 * Uses dataLayer.push which queues events until gtag.js loads
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (!isBrowser()) {
    return;
  }

  ensureDataLayer();

  // Use dataLayer.push - this queues the event and gtag will process it when ready
  window.dataLayer!.push({
    event: eventName,
    ...params,
  });

  console.log('[Analytics] Event queued:', eventName, params);
}

/**
 * Track event using gtag directly (waits for gtag to be available)
 * Fallback to dataLayer if gtag isn't ready within timeout
 */
export function trackEventWithGtag(
  eventName: string,
  params?: Record<string, unknown>,
  maxRetries: number = 10,
  retryDelay: number = 200
): void {
  if (!isBrowser()) {
    return;
  }

  let retries = 0;

  const tryTrack = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
      console.log('[Analytics] Event tracked via gtag:', eventName, params);
    } else if (retries < maxRetries) {
      retries++;
      setTimeout(tryTrack, retryDelay);
    } else {
      // Fallback to dataLayer after max retries
      ensureDataLayer();
      window.dataLayer!.push({
        event: eventName,
        ...params,
      });
      console.log('[Analytics] Event queued via dataLayer (gtag timeout):', eventName, params);
    }
  };

  tryTrack();
}

// ========================================
// E-COMMERCE EVENTS (GA4 Standard)
// ========================================

interface EcommerceItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity: number;
}

/**
 * Track when user starts checkout process
 * https://developers.google.com/analytics/devguides/collection/ga4/reference/events#begin_checkout
 */
export function trackBeginCheckout(
  items: EcommerceItem[],
  totalValue: number,
  currency: string = 'USD'
): void {
  trackEventWithGtag('begin_checkout', {
    currency,
    value: totalValue,
    items,
  });
}

/**
 * Track successful purchase/conversion
 * https://developers.google.com/analytics/devguides/collection/ga4/reference/events#purchase
 */
export function trackPurchase(
  transactionId: string,
  items: EcommerceItem[],
  totalValue: number,
  currency: string = 'USD'
): void {
  trackEventWithGtag('purchase', {
    transaction_id: transactionId,
    currency,
    value: totalValue,
    items,
  });
}

/**
 * Track when user adds item to cart
 * https://developers.google.com/analytics/devguides/collection/ga4/reference/events#add_to_cart
 */
export function trackAddToCart(
  item: EcommerceItem,
  currency: string = 'USD'
): void {
  trackEventWithGtag('add_to_cart', {
    currency,
    value: item.price * item.quantity,
    items: [item],
  });
}

/**
 * Track page view (useful for SPAs)
 */
export function trackPageView(
  pagePath: string,
  pageTitle?: string
): void {
  trackEventWithGtag('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
}

// ========================================
// CAN'T WAIT TRAVEL SPECIFIC EVENTS
// ========================================

/**
 * Track shuttle booking checkout start
 */
export function trackShuttleCheckout(
  bookingId: string,
  trips: Array<{
    from: string;
    to: string;
    price: number;
    passengers: number;
  }>,
  totalValue: number
): void {
  const items: EcommerceItem[] = trips.map((trip, index) => ({
    item_id: `shuttle_${bookingId}_${index}`,
    item_name: `${trip.from} → ${trip.to}`,
    item_category: 'Shuttle',
    price: trip.price,
    quantity: trip.passengers,
  }));

  trackBeginCheckout(items, totalValue);
}

/**
 * Track tour booking checkout start
 */
export function trackTourCheckout(
  bookingId: string,
  tourName: string,
  totalValue: number,
  passengers: number
): void {
  // Price per person to avoid GA4 multiplying price × quantity
  const pricePerPerson = passengers > 0 ? totalValue / passengers : totalValue;

  const items: EcommerceItem[] = [{
    item_id: `tour_${bookingId}`,
    item_name: tourName,
    item_category: 'Private Tour',
    price: pricePerPerson,
    quantity: passengers,
  }];

  trackBeginCheckout(items, totalValue);
}

/**
 * Track successful shuttle purchase
 */
export function trackShuttlePurchase(
  bookingId: string,
  trips: Array<{
    from: string;
    to: string;
    price: number;
    passengers: number;
  }>,
  totalValue: number
): void {
  const items: EcommerceItem[] = trips.map((trip, index) => ({
    item_id: `shuttle_${bookingId}_${index}`,
    item_name: `${trip.from} → ${trip.to}`,
    item_category: 'Shuttle',
    price: trip.price,
    quantity: trip.passengers,
  }));

  trackPurchase(bookingId, items, totalValue);
}

/**
 * Track successful tour purchase
 */
export function trackTourPurchase(
  bookingId: string,
  tourName: string,
  totalValue: number,
  passengers: number
): void {
  // Price per person to avoid GA4 multiplying price × quantity
  const pricePerPerson = passengers > 0 ? totalValue / passengers : totalValue;

  const items: EcommerceItem[] = [{
    item_id: `tour_${bookingId}`,
    item_name: tourName,
    item_category: 'Private Tour',
    price: pricePerPerson,
    quantity: passengers,
  }];

  trackPurchase(bookingId, items, totalValue);
}

/**
 * Track form submission errors
 */
export function trackFormError(
  formName: string,
  errorType: string
): void {
  trackEvent('form_error', {
    form_name: formName,
    error_type: errorType,
  });
}

/**
 * Track WhatsApp button clicks
 */
export function trackWhatsAppClick(
  location: string
): void {
  trackEvent('whatsapp_click', {
    click_location: location,
  });
}
