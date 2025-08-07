/*
 * Credit System – Mock Constants
 * ---------------------------------------------------------------------------
 * These values are used throughout the credit-related features for initial
 * development and testing. All figures are placeholders and should be replaced
 * with environment-specific or database-driven values before production.
 */

/* ---------------------------------------------------------------------------
 * Daily Allocation
 * ---------------------------------------------------------------------------*/

/**
 * Number of free credits granted to every user every 24 hours.
 */
export const DAILY_FREE_CREDITS: number = 5;

/* ---------------------------------------------------------------------------
 * Transaction Types
 * ---------------------------------------------------------------------------*/

/**
 * Discriminator for the type field on `credit_transactions`.
 */
export enum CreditTransactionType {
  DAILY_ALLOCATION = 'DAILY_ALLOCATION',
  PURCHASE = 'PURCHASE',
  MANUAL_ADJUST = 'MANUAL_ADJUST',
  CONSUMPTION = 'CONSUMPTION',
}

/* ---------------------------------------------------------------------------
 * Credit Packages (Mock)
 * ---------------------------------------------------------------------------*/

export interface CreditPackage {
  /** Unique identifier for the package (matches DB primary key in prod). */
  id: string;
  /** Number of credits the user receives. */
  credits: number;
  /** Price in the smallest currency unit (e.g. cents). */
  priceCents: number;
  /** ISO-4217 currency code (e.g. USD, EUR). */
  currency: string;
}

/**
 * Hard-coded set of packages exposed by the `GET /api/credits/packages` endpoint
 * during early development. Replace with database-driven lookup later.
 */
export const MOCK_CREDIT_PACKAGES: Readonly<CreditPackage[]> = [
  { id: 'pkg_small', credits: 20, priceCents: 199, currency: 'USD' },
  { id: 'pkg_medium', credits: 60, priceCents: 499, currency: 'USD' },
  { id: 'pkg_large', credits: 150, priceCents: 999, currency: 'USD' },
];

/* ---------------------------------------------------------------------------
 * API Endpoints
 * ---------------------------------------------------------------------------*/

export const CREDIT_API_ENDPOINTS = {
  PACKAGES: '/api/credits/packages',
  PURCHASE: '/api/credits/purchase',
  STRIPE_WEBHOOK: '/api/webhooks/stripe',
} as const;

/* ---------------------------------------------------------------------------
 * Environment Variable Keys
 * ---------------------------------------------------------------------------*/

export const ENV_VARS = {
  STRIPE_PUBLISHABLE_KEY: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  STRIPE_WEBHOOK_SECRET: 'STRIPE_WEBHOOK_SECRET',
  DAILY_FREE_CREDITS: 'DAILY_FREE_CREDITS',
} as const;
