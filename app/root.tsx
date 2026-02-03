import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useMatches,
  useRouteError,
  useLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
} from '@remix-run/react';
import type {CustomerAccessToken} from '@shopify/hydrogen-react/storefront-api-types';
import type {HydrogenSession} from '../server';
import favicon from '../public/favicon.svg';
import resetStyles from './styles/reset.css';
import appStyles from './styles/app.css';
import {Layout} from '~/components/Layout';
import tailwindCss from './styles/tailwind.css';

export function links() {
  return [
    {rel: 'stylesheet', href: tailwindCss},
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: appStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    // Cloudinary CDN for image optimization (if configured)
    {
      rel: 'preconnect',
      href: 'https://res.cloudinary.com',
    },
    // Stripe for checkout
    {
      rel: 'preconnect',
      href: 'https://js.stripe.com',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

export async function loader({context}: LoaderArgs) {
  const {storefront, session, cart} = context;
  const customerAccessToken = await session.get('customerAccessToken');
  const publicStoreDomain = context.env.PUBLIC_STORE_DOMAIN;

  // validate the customer access token is valid
  const {isLoggedIn, headers} = await validateCustomerAccessToken(
    customerAccessToken,
    session,
  );

  // defer the cart query by not awaiting it
  const cartPromise = cart.get();

  // defer the footer query (below the fold)
  const footerPromise = storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'footer', // Adjust to your footer menu handle
    },
  });

  // await the header query (above the fold)
  const headerPromise = storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'main-menu', // Adjust to your header menu handle
    },
  });

  return defer(
    {
      cart: cartPromise,
      footer: footerPromise,
      header: await headerPromise,
      isLoggedIn,
      publicStoreDomain,
    },
    {headers},
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout {...data}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const [root] = useMatches();
  let errorMessage = 'Something went wrong';
  let errorStatus = 500;
  let errorTitle = 'Oops!';

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;

    if (errorStatus === 404) {
      errorTitle = 'Page Not Found';
      errorMessage = "The page you're looking for doesn't exist.";
    } else if (errorStatus === 500) {
      errorTitle = 'Server Error';
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const rootData = root?.data as any;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{errorTitle} | Mock.shop</title>
        <Meta />
        <Links />
      </head>
      <body>
        {rootData ? (
          <Layout {...rootData}>
            <ErrorContent
              status={errorStatus}
              title={errorTitle}
              message={errorMessage}
            />
          </Layout>
        ) : (
          <ErrorContent
            status={errorStatus}
            title={errorTitle}
            message={errorMessage}
          />
        )}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function ErrorContent({
  status,
  title,
  message,
}: {
  status: number;
  title: string;
  message: string;
}) {
  return (
    <div className="route-error">
      <h1>{title}</h1>
      <h2>{status}</h2>
      <p style={{marginBottom: '24px', color: '#707070'}}>{message}</p>
      <div style={{display: 'flex', gap: '16px', justifyContent: 'center'}}>
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '14px 28px',
            background: '#000',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '2px',
          }}
        >
          Go to Homepage
        </a>
        <a
          href="/collections"
          style={{
            display: 'inline-block',
            padding: '14px 28px',
            background: 'transparent',
            color: '#000',
            textDecoration: 'none',
            borderRadius: '2px',
            border: '1px solid #000',
          }}
        >
          Browse Collections
        </a>
      </div>
    </div>
  );
}

/**
 * Validates the customer access token and returns a boolean and headers
 * @see https://shopify.dev/docs/api/storefront/latest/objects/CustomerAccessToken
 *
 * @example
 * ```ts
 * //
 * const {isLoggedIn, headers} = await validateCustomerAccessToken(
 *  customerAccessToken,
 *  session,
 *  );
 *  ```
 *  */
async function validateCustomerAccessToken(
  customerAccessToken: CustomerAccessToken,
  session: HydrogenSession,
) {
  let isLoggedIn = false;
  const headers = new Headers();
  if (!customerAccessToken?.accessToken || !customerAccessToken?.expiresAt) {
    return {isLoggedIn, headers};
  }
  const expiresAt = new Date(customerAccessToken.expiresAt);
  const dateNow = new Date();
  const customerAccessTokenExpired = expiresAt < dateNow;
  if (customerAccessTokenExpired) {
    session.unset('customerAccessToken');
    headers.append('Set-Cookie', await session.commit());
  } else {
    isLoggedIn = true;
  }

  return {isLoggedIn, headers};
}

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;
// Cache bust: 1770147562
