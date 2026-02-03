/**
 * Remix/Hydrogen-specific Mocks for Tests
 *
 * This file provides mocks for Remix hooks and Hydrogen components
 * that are difficult to test directly. Use vi.mock() to replace
 * real implementations with these controlled versions.
 *
 * LEARNING: Mocking External Dependencies
 * - Mock at the module level with vi.mock()
 * - Return simple implementations that capture behavior
 * - Allow tests to control mock return values
 */
import {vi} from 'vitest';
import React, {type ReactNode} from 'react';

// ============================================
// MOCK FETCHER
// ============================================

export type MockFetcherState = 'idle' | 'loading' | 'submitting';

export interface MockFetcher<T = unknown> {
  state: MockFetcherState;
  data: T | undefined;
  formData: FormData | undefined;
  submit: ReturnType<typeof vi.fn>;
  load: ReturnType<typeof vi.fn>;
  Form: React.FC<{children: ReactNode; [key: string]: unknown}>;
}

export function createMockFetcher<T = unknown>(
  overrides: Partial<MockFetcher<T>> = {},
): MockFetcher<T> {
  const Form: React.FC<{children: ReactNode; [key: string]: unknown}> = ({
    children,
    ...props
  }) => {
    // eslint-disable-next-line react/prop-types
    return <form {...props}>{children}</form>;
  };

  return {
    state: 'idle',
    data: undefined,
    formData: undefined,
    submit: vi.fn(),
    load: vi.fn(),
    Form,
    ...overrides,
  };
}

// ============================================
// MOCK LOADER DATA
// ============================================

export interface MockLoaderData {
  [key: string]: unknown;
}

export function createMockLoaderData(data: MockLoaderData = {}): MockLoaderData {
  return {
    publicStoreDomain: 'mock.shop',
    ...data,
  };
}

// ============================================
// MOCK MATCHES (for useMatches)
// ============================================

export interface MockMatch {
  id: string;
  pathname: string;
  params: Record<string, string>;
  data: MockLoaderData;
  handle?: unknown;
}

export function createMockMatches(overrides: Partial<MockMatch>[] = []): MockMatch[] {
  const defaults: MockMatch[] = [
    {
      id: 'root',
      pathname: '/',
      params: {},
      data: createMockLoaderData(),
    },
  ];

  return overrides.length > 0
    ? overrides.map((override, i) => ({...defaults[i] || defaults[0], ...override}))
    : defaults;
}

// ============================================
// MOCK REVALIDATOR
// ============================================

export interface MockRevalidator {
  state: 'idle' | 'loading';
  revalidate: ReturnType<typeof vi.fn>;
}

export function createMockRevalidator(
  overrides: Partial<MockRevalidator> = {},
): MockRevalidator {
  return {
    state: 'idle',
    revalidate: vi.fn(),
    ...overrides,
  };
}

// ============================================
// REMIX HOOK MOCKS (for vi.mock)
// ============================================

/**
 * Creates a mock implementation of @remix-run/react
 *
 * Usage:
 * ```ts
 * vi.mock('@remix-run/react', () => createRemixMock());
 * ```
 */
export function createRemixMock(overrides: {
  loaderData?: MockLoaderData;
  matches?: MockMatch[];
  fetcher?: MockFetcher;
  params?: Record<string, string>;
} = {}) {
  const fetcher = overrides.fetcher || createMockFetcher();
  const matches = overrides.matches || createMockMatches();
  const params = overrides.params || {};

  return {
    // Navigation components
    Link: ({children, to, ...props}: {children: ReactNode; to: string; [key: string]: unknown}) => (
      <a href={to} {...props}>{children}</a>
    ),
    NavLink: ({children, to, ...props}: {children: ReactNode; to: string; [key: string]: unknown}) => (
      <a href={to} {...props}>{children}</a>
    ),
    Form: ({children, ...props}: {children: ReactNode; [key: string]: unknown}) => (
      <form {...props}>{children}</form>
    ),

    // Hooks
    useLoaderData: () => overrides.loaderData || createMockLoaderData(),
    useFetcher: () => fetcher,
    useFetchers: () => [fetcher],
    useMatches: () => matches,
    useParams: () => params,
    useNavigate: () => vi.fn(),
    useLocation: () => ({pathname: '/', search: '', hash: '', state: null, key: 'default'}),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
    useRevalidator: () => createMockRevalidator(),

    // Async boundary components
    Await: ({resolve, children}: {resolve: unknown; children: (data: unknown) => ReactNode}) => {
      // For sync testing, resolve immediately
      if (resolve instanceof Promise) {
        return null; // Will need Suspense boundary in real usage
      }
      return <>{children(resolve)}</>;
    },

    // Outlet for nested routes
    Outlet: () => null,
  };
}

// ============================================
// HYDROGEN COMPONENT MOCKS
// ============================================

/**
 * Creates a mock implementation of @shopify/hydrogen
 *
 * Usage:
 * ```ts
 * vi.mock('@shopify/hydrogen', async () => ({
 *   ...(await vi.importActual('@shopify/hydrogen')),
 *   ...createHydrogenMock(),
 * }));
 * ```
 */
export function createHydrogenMock() {
  return {
    // Money component - renders price as simple text
    Money: ({data}: {data: {amount: string; currencyCode: string}}) => (
      <span data-testid="mock-money">${data.amount}</span>
    ),

    // Image component - renders simple img
    Image: ({
      data,
      src,
      alt,
      ...props
    }: {
      data?: {url: string; altText?: string | null};
      src?: string;
      alt?: string;
      [key: string]: unknown;
    }) => (
      <img
        data-testid="mock-image"
        src={data?.url || src}
        alt={data?.altText || alt || ''}
        {...props}
      />
    ),

    // CartForm - renders as a simple form
    CartForm: Object.assign(
      ({children, action, inputs}: {children: ReactNode; action: string; inputs?: unknown}) => (
        <form data-testid="mock-cart-form" data-action={action}>
          <input type="hidden" name="inputs" value={JSON.stringify(inputs)} />
          {children}
        </form>
      ),
      {
        ACTIONS: {
          LinesAdd: 'LinesAdd',
          LinesUpdate: 'LinesUpdate',
          LinesRemove: 'LinesRemove',
          DiscountCodesUpdate: 'DiscountCodesUpdate',
          BuyerIdentityUpdate: 'BuyerIdentityUpdate',
          NoteUpdate: 'NoteUpdate',
          AttributesUpdate: 'AttributesUpdate',
        },
      },
    ),

    // Pagination - renders children with mock connection
    Pagination: ({
      connection,
      children,
    }: {
      connection: {nodes: unknown[]};
      children: (props: {
        nodes: unknown[];
        isLoading: boolean;
        NextLink: React.FC<{children: ReactNode}>;
        PreviousLink: React.FC<{children: ReactNode}>;
      }) => ReactNode;
    }) => {
      const MockLink: React.FC<{children: ReactNode}> = ({children}) => (
        <button type="button">{children}</button>
      );
      return (
        <>
          {children({
            nodes: connection.nodes,
            isLoading: false,
            NextLink: MockLink,
            PreviousLink: MockLink,
          })}
        </>
      );
    },

    // parseMetafield - return mock parsed value
    parseMetafield: (field: {type: string; value: string}) => ({
      ...field,
      parsedValue: field.value,
    }),
  };
}

// ============================================
// STOREFRONT CLIENT MOCK
// ============================================

export interface MockStorefrontQuery {
  query: ReturnType<typeof vi.fn>;
  mutate: ReturnType<typeof vi.fn>;
}

export function createMockStorefront(
  responses: Record<string, unknown> = {},
): MockStorefrontQuery {
  return {
    query: vi.fn().mockImplementation((query: string) => {
      // Return matching response based on query content
      for (const [key, value] of Object.entries(responses)) {
        if (query.includes(key)) {
          return Promise.resolve(value);
        }
      }
      return Promise.resolve({});
    }),
    mutate: vi.fn().mockResolvedValue({}),
  };
}
