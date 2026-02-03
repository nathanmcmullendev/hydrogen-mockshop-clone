/// <reference types="@remix-run/dev" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="vite/client" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

import type {Storefront, HydrogenCart} from '@shopify/hydrogen';
import type {HydrogenSession} from './server';

/**
 * Vite environment variables (VITE_* prefix)
 * These are statically replaced at build time and available on client
 */
interface ImportMetaEnv {
  readonly VITE_CLOUDINARY_CLOUD?: string;
  readonly VITE_STRIPE_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: {env: {NODE_ENV: 'production' | 'development'}};

  /**
   * Declare expected Env parameter in fetch handler.
   */
  interface Env {
    SESSION_SECRET: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PRIVATE_STOREFRONT_API_TOKEN: string;
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_ID: string;
    // Stripe checkout
    STRIPE_SECRET_KEY?: string;
    VITE_STRIPE_PUBLIC_KEY?: string;
    // Shopify Admin API for order creation
    SHOPIFY_ADMIN_ACCESS_TOKEN?: string;
    // Image optimization
    VITE_CLOUDINARY_CLOUD?: string;
  }
}

/**
 * Declare local additions to `AppLoadContext` to include the session utilities we injected in `server.ts`.
 */
declare module '@shopify/remix-oxygen' {
  export interface AppLoadContext {
    env: Env;
    cart: HydrogenCart;
    storefront: Storefront;
    session: HydrogenSession;
  }
}
