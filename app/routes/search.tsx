import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, Form, useSearchParams, useSubmit} from '@remix-run/react';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';

/**
 * LEARNING NOTE: Sort Options Pattern
 *
 * This demonstrates a common e-commerce pattern: URL-driven state.
 *
 * Why URL params instead of React state?
 * 1. Shareable - users can share "?q=shoes&sort=PRICE_ASC" links
 * 2. Bookmarkable - browser back/forward works correctly
 * 3. SEO-friendly - search engines can index sorted results
 * 4. Server-rendered - sort happens on server, not client hydration flicker
 *
 * The flow: URL params → Remix loader → GraphQL query → rendered results
 */

// Define available sort options with user-friendly labels
// These map to Shopify's SearchSortKeys enum
export const SORT_OPTIONS = [
  {key: 'RELEVANCE', label: 'Relevance', direction: null},
  {key: 'PRICE', label: 'Price: Low to High', direction: 'ASC'},
  {key: 'PRICE', label: 'Price: High to Low', direction: 'DESC'},
] as const;

// Create a combined key for URL (e.g., "PRICE_ASC")
// Exported for testing - demonstrates how to make utils testable
export function getSortParam(key: string, direction: string | null): string {
  return direction ? `${key}_${direction}` : key;
}

// Parse the combined key back into parts
// Exported for testing - demonstrates how to make utils testable
export function parseSortParam(param: string): {key: string; reverse: boolean} {
  if (param.endsWith('_DESC')) {
    return {key: param.replace('_DESC', ''), reverse: true};
  }
  if (param.endsWith('_ASC')) {
    return {key: param.replace('_ASC', ''), reverse: false};
  }
  return {key: param, reverse: false};
}

export const meta: V2_MetaFunction = () => {
  return [{title: `Mock.shop | Search`}];
};

export async function loader({request, context}: LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const variables = getPaginationVariables(request, {pageBy: 8});
  const searchTerm = String(searchParams.get('q') || '');

  // LEARNING: Extract sort from URL, default to RELEVANCE
  const sortParam = searchParams.get('sort') || 'RELEVANCE';
  const {key: sortKey, reverse} = parseSortParam(sortParam);

  if (!searchTerm) {
    return {
      searchResults: {results: null, totalResults: 0},
      searchTerm,
      sortParam, // Pass back to UI so dropdown shows current selection
    };
  }

  // LEARNING: Pass sortKey and reverse to GraphQL
  // Shopify's search API uses `sortKey` enum and `reverse` boolean
  const data = await context.storefront.query(SEARCH_QUERY, {
    variables: {
      query: searchTerm,
      sortKey,
      reverse,
      ...variables,
    },
  });

  if (!data) {
    throw new Error('No search data returned from Shopify API');
  }

  const totalResults = Object.values(data).reduce((total, value) => {
    return total + value.nodes.length;
  }, 0);

  const searchResults = {
    results: data,
    totalResults,
  };

  return defer({searchTerm, searchResults, sortParam});
}

export default function SearchPage() {
  const {searchTerm, searchResults, sortParam} = useLoaderData<typeof loader>();
  const products = searchResults.results?.products?.nodes || [];
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  /**
   * LEARNING: Handle sort change
   *
   * When user selects a new sort option:
   * 1. Create new URLSearchParams preserving existing query
   * 2. Update the 'sort' param
   * 3. Submit as GET request (triggers loader rerun)
   *
   * This is the "URL as state" pattern - React state lives in the URL,
   * and Remix's loader handles the actual data fetching.
   */
  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', event.target.value);
    submit(newParams, {method: 'get'});
  }

  return (
    <div className="search-page">
      <h1 className="search-page-title">Search results</h1>

      <div className="search-page-input-wrapper">
        <Form method="get" className="search-page-form">
          <label htmlFor="search-input" className="search-input-label">Search</label>
          <div className="search-input-container">
            <input
              id="search-input"
              type="search"
              name="q"
              defaultValue={searchTerm}
              placeholder="Search..."
              className="search-page-input"
            />
            {/* Preserve sort when submitting new search */}
            <input type="hidden" name="sort" value={sortParam} />
            <button type="submit" className="search-submit-btn" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </button>
          </div>
        </Form>
      </div>

      {searchTerm && (
        <div className="search-filters-bar">
          <div className="search-filters-left">
            {/* Filter UI removed - was non-functional placeholder */}
            {/* TODO: Implement filters using Shopify's product filters API */}
          </div>
          <div className="search-filters-right">
            <label htmlFor="sort-select" className="search-filter-label">Sort by:</label>
            {/*
              LEARNING: Native select vs custom dropdown

              Using native <select> because:
              1. Accessible by default (keyboard, screen readers)
              2. Mobile-friendly (native picker UI)
              3. No JS required for basic functionality
              4. Easier to style with CSS (appearance: none + custom arrow)

              Custom dropdowns need significant a11y work to match native.
            */}
            <select
              id="sort-select"
              className="search-sort-select"
              value={sortParam}
              onChange={handleSortChange}
            >
              {SORT_OPTIONS.map((option) => {
                const value = getSortParam(option.key, option.direction);
                return (
                  <option key={value} value={value}>
                    {option.label}
                  </option>
                );
              })}
            </select>
            <span className="search-results-count">{searchResults.totalResults} results</span>
          </div>
        </div>
      )}

      {!searchTerm ? (
        <p className="search-empty">Enter a search term to find products.</p>
      ) : products.length === 0 ? (
        <p className="search-empty">No results found for "{searchTerm}"</p>
      ) : (
        <div className="search-results-grid">
          {products.map((product: any) => {
            const variant = product.variants?.nodes?.[0];
            const image = variant?.image;
            const price = variant?.price;

            return (
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                className="search-product-card"
              >
                {image && (
                  <div className="search-product-image">
                    <Image
                      data={image}
                      aspectRatio="1/1"
                      sizes="(min-width: 45em) 20vw, 50vw"
                    />
                  </div>
                )}
                <h3 className="search-product-title">{product.title}</h3>
                {price && (
                  <p className="search-product-price">
                    <Money data={price} />
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * LEARNING: GraphQL Query with Dynamic Sort
 *
 * Key concepts demonstrated:
 * 1. Variables ($sortKey, $reverse) allow runtime query customization
 * 2. SearchSortKeys enum - Shopify's allowed sort options
 * 3. reverse: Boolean - flips sort direction (ASC/DESC)
 * 4. Default values in GraphQL ($sortKey: SearchSortKeys = RELEVANCE)
 *
 * Available SearchSortKeys:
 * - RELEVANCE: Best match for search term (default)
 * - PRICE: Sort by price (use reverse for high-to-low)
 *
 * Note: Some sort keys like BEST_SELLING, CREATED_AT work on
 * collection.products but not on the unified search endpoint.
 */
const SEARCH_QUERY = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    variants(first: 1) {
      nodes {
        id
        image {
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        product {
          handle
          title
        }
      }
    }
  }
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
  query search(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $query: String!
    $startCursor: String
    $sortKey: SearchSortKeys = RELEVANCE
    $reverse: Boolean = false
  ) @inContext(country: $country, language: $language) {
    products: search(
      query: $query,
      unavailableProducts: HIDE,
      types: [PRODUCT],
      first: $first,
      sortKey: $sortKey,
      reverse: $reverse,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
    pages: search(
      query: $query,
      types: [PAGE],
      first: 10
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    articles: search(
      query: $query,
      types: [ARTICLE],
      first: 10
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
  }
` as const;
