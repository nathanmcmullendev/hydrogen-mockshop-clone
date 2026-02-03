// Virtual entry point for the app
import * as remixBuild from '@remix-run/dev/server-build';
import {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createStorefrontClient,
  storefrontRedirect,
} from '@shopify/hydrogen';
import {
  createRequestHandler,
  getStorefrontHeaders,
  createCookieSessionStorage,
  type SessionStorage,
  type Session,
} from '@shopify/remix-oxygen';

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      // Merge process.env into env for Vercel compatibility
      // Vercel Edge passes env vars via process.env, not worker env parameter
      const mergedEnv: Env = {
        ...env,
        SESSION_SECRET: env.SESSION_SECRET || (process.env as any).SESSION_SECRET,
        PUBLIC_STORE_DOMAIN: env.PUBLIC_STORE_DOMAIN || (process.env as any).PUBLIC_STORE_DOMAIN,
        PUBLIC_STOREFRONT_API_TOKEN: env.PUBLIC_STOREFRONT_API_TOKEN || (process.env as any).PUBLIC_STOREFRONT_API_TOKEN,
        PRIVATE_STOREFRONT_API_TOKEN: env.PRIVATE_STOREFRONT_API_TOKEN || (process.env as any).PRIVATE_STOREFRONT_API_TOKEN,
        PUBLIC_STOREFRONT_ID: env.PUBLIC_STOREFRONT_ID || (process.env as any).PUBLIC_STOREFRONT_ID,
        // Stripe checkout
        STRIPE_SECRET_KEY: env.STRIPE_SECRET_KEY || (process.env as any).STRIPE_SECRET_KEY,
        VITE_STRIPE_PUBLIC_KEY: env.VITE_STRIPE_PUBLIC_KEY || (process.env as any).VITE_STRIPE_PUBLIC_KEY,
        // Shopify Admin
        SHOPIFY_ADMIN_ACCESS_TOKEN: env.SHOPIFY_ADMIN_ACCESS_TOKEN || (process.env as any).SHOPIFY_ADMIN_ACCESS_TOKEN,
        SHOPIFY_ADMIN_STORE_DOMAIN: env.SHOPIFY_ADMIN_STORE_DOMAIN || (process.env as any).SHOPIFY_ADMIN_STORE_DOMAIN,
        // Cloudinary
        VITE_CLOUDINARY_CLOUD: env.VITE_CLOUDINARY_CLOUD || (process.env as any).VITE_CLOUDINARY_CLOUD,
      };

      /**
       * Open a cache instance in the worker and a custom session instance.
       */
      if (!mergedEnv?.SESSION_SECRET) {
        throw new Error('SESSION_SECRET environment variable is not set');
      }

      const waitUntil = (p: Promise<any>) => executionContext.waitUntil(p);
      const [cache, session] = await Promise.all([
        caches.open('hydrogen'),
        HydrogenSession.init(request, [mergedEnv.SESSION_SECRET]),
      ]);

      /**
       * Create Hydrogen's Storefront client.
       */
      const {storefront} = createStorefrontClient({
        cache,
        waitUntil,
        i18n: {language: 'EN', country: 'US'},
        publicStorefrontToken: mergedEnv.PUBLIC_STOREFRONT_API_TOKEN,
        privateStorefrontToken: mergedEnv.PRIVATE_STOREFRONT_API_TOKEN,
        storeDomain: mergedEnv.PUBLIC_STORE_DOMAIN,
        storefrontId: mergedEnv.PUBLIC_STOREFRONT_ID,
        storefrontHeaders: getStorefrontHeaders(request),
      });

      /*
       * Create a cart handler that will be used to
       * create and update the cart in the session.
       */
      const cart = createCartHandler({
        storefront,
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault(),
        cartQueryFragment: CART_QUERY_FRAGMENT,
      });

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({session, storefront, env: mergedEnv, cart}),
      });

      const response = await handleRequest(request);

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({request, response, storefront});
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};

/**
 * This is a custom session implementation for your Hydrogen shop.
 * Feel free to customize it to your needs, add helper methods, or
 * swap out the cookie-based implementation with something else!
 */
export class HydrogenSession {
  constructor(
    private sessionStorage: SessionStorage,
    private session: Session,
  ) {}

  static async init(request: Request, secrets: string[]) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
      },
    });

    const session = await storage.getSession(request.headers.get('Cookie'));

    return new this(storage, session);
  }

  has(key: string) {
    return this.session.has(key);
  }

  get(key: string) {
    return this.session.get(key);
  }

  destroy() {
    return this.sessionStorage.destroySession(this.session);
  }

  flash(key: string, value: any) {
    this.session.flash(key, value);
  }

  unset(key: string) {
    this.session.unset(key);
  }

  set(key: string, value: any) {
    this.session.set(key, value);
  }

  commit() {
    return this.sessionStorage.commitSession(this.session);
  }
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/cart
const CART_QUERY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height

        }
        product {
          handle
          title
          id
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
  fragment CartApiQuery on Cart {
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      nodes {
        ...CartLine
      }
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
      totalDutyAmount {
        ...Money
      }
      totalTaxAmount {
        ...Money
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
` as const;
