// src/lib/tilopay.ts
// Tilopay API Integration Utilities

export const TILOPAY_CONFIG = {
  API_URL: process.env.TILOPAY_API_URL || 'https://app.tilopay.com/api/v1',
  API_USER: process.env.TILOPAY_API_USER || '',
  API_PASSWORD: process.env.TILOPAY_API_PASSWORD || '',
  API_KEY: process.env.TILOPAY_API_KEY || '',
};

export interface TilopayTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface TilopayPaymentRequest {
  redirect: string;
  key: string;
  amount: string;
  currency: string;
  orderNumber: string;
  capture: string;
  subscription: string;
  platform: string;
  billToFirstName: string;
  billToLastName: string;
  billToAddress: string;
  billToAddress2: string;
  billToCity: string;
  billToState: string;
  billToZipPostCode: string;
  billToCountry: string;
  billToTelephone: string;
  billToEmail: string;
  shipToFirstName?: string;
  shipToLastName?: string;
  shipToAddress?: string;
  shipToAddress2?: string;
  shipToCity?: string;
  shipToState?: string;
  shipToZipPostCode?: string;
  shipToCountry?: string;
  shipToTelephone?: string;
  returnData?: string;
  hashVersion?: string;
}

export interface TilopayPaymentResponse {
  success: boolean;
  url?: string;
  message?: string;
  code?: number;
}

export interface TilopayCallbackParams {
  code: string;
  description: string;
  auth: string;
  order: string;
  tpt: string;
  crd: string;
  'tilopay-transaction': string;
  OrderHash: string;
  returnData: string;
  form_update: string;
}

// Token cache to avoid unnecessary requests
let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getTilopayToken(): Promise<string> {
  // Check if we have a valid cached token (with 5 min buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cachedToken.token;
  }

  const response = await fetch(`${TILOPAY_CONFIG.API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiuser: TILOPAY_CONFIG.API_USER,
      password: TILOPAY_CONFIG.API_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tilopay authentication failed: ${response.statusText}`);
  }

  const data: TilopayTokenResponse = await response.json();

  // Cache the token
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

export async function createTilopayPayment(
  token: string,
  paymentData: TilopayPaymentRequest
): Promise<TilopayPaymentResponse> {
  const response = await fetch(`${TILOPAY_CONFIG.API_URL}/processPayment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Tilopay payment error:', errorText);
    return {
      success: false,
      message: `Payment request failed: ${response.statusText}`,
    };
  }

  const data = await response.json();

  // Tilopay returns the payment form URL
  if (data.url) {
    return {
      success: true,
      url: data.url,
    };
  }

  return {
    success: false,
    message: data.message || 'Unknown error',
    code: data.code,
  };
}

export function isPaymentApproved(code: string): boolean {
  return code === '1';
}

export function encodeReturnData(data: object): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

export function decodeReturnData(encoded: string): object | null {
  try {
    return JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}
