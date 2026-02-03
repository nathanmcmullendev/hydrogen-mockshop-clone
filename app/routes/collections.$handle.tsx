import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {json, redirect, type LoaderArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, useSearchParams, useSubmit} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/utils';

/**
 * LEARNING: Reusing Sort Pattern from Search
 *
 * This demonstrates code reuse across routes. The same URL-driven sort pattern
 * works for both search and collections, but with different sort keys.
 *
 * Collection sort keys (ProductCollectionSortKeys):
 * - BEST_SELLING: Most popular products first
 * - PRICE: Sort by price
 * - CREATED: Newest products first
 * - TITLE: Alphabetical order
 * - COLLECTION_DEFAULT: Admin-defined order (manual)
 * - MANUAL: Same as COLLECTION_DEFAULT
 *
 * Search sort keys (SearchSortKeys) - different API:
 * - RELEVANCE: Best match for search term
 * - PRICE: Sort by price
 *
 * Key learning: Different Shopify APIs have different sort options.
 * Always check the GraphQL schema for available enum values.
 */

// Collection-specific sort options
// These map to Shopify's ProductCollectionSortKeys enum
export const COLLECTION_SORT_OPTIONS = [
  {key: 'COLLECTION_DEFAULT', label: 'Featured', direction: null},
  {key: 'BEST_SELLING', label: 'Best Selling', direction: null},
  {key: 'CREATED', label: 'Newest', direction: 'DESC'},
  {key: 'PRICE', label: 'Price: Low to High', direction: 'ASC'},
  {key: 'PRICE', label: 'Price: High to Low', direction: 'DESC'},
  {key: 'TITLE', label: 'Alphabetically: A-Z', direction: 'ASC'},
  {key: 'TITLE', label: 'Alphabetically: Z-A', direction: 'DESC'},
] as const;

// Reuse the same URL encoding pattern from search
export function getSortParam(key: string, direction: string | null): string {
  return direction ? `${key}_${direction}` : key;
}

export function parseSortParam(param: string): {key: string; reverse: boolean} {
  if (param.endsWith('_DESC')) {
    return {key: param.replace('_DESC', ''), reverse: true};
  }
  if (param.endsWith('_ASC')) {
    return {key: param.replace('_ASC', ''), reverse: false};
  }
  return {key: param, reverse: false};
}

export const meta: V2_MetaFunction = ({data}) => {
  return [{title: `Mock.shop | ${data?.collection?.title ?? 'Collection'}`}];
};

export async function loader({request, params, context}: LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    return redirect('/collections');
  }

  // LEARNING: Extract sort from URL params
  const url = new URL(request.url);
  const sortParam = url.searchParams.get('sort') || 'COLLECTION_DEFAULT';
  const {key: sortKey, reverse} = parseSortParam(sortParam);

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      sortKey,
      reverse,
      ...paginationVariables,
    },
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return json({collection, sortParam});
}

export default function Collection() {
  const {collection, sortParam} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  /**
   * LEARNING: Sort Change Handler
   *
   * Same pattern as search page:
   * 1. Get current URL params
   * 2. Update sort param
   * 3. Submit as GET (triggers loader)
   *
   * Note: We preserve other params (like pagination cursors) but
   * Hydrogen's Pagination component will reset on sort change anyway.
   */
  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', event.target.value);
    // Remove pagination cursors when sort changes - start fresh
    newParams.delete('cursor');
    newParams.delete('direction');
    submit(newParams, {method: 'get'});
  }

  return (
    <div className="collection-page">
      <div className="collection-header">
        <div className="collection-header-top">
          <div>
            <h1>{collection.title}</h1>
            {collection.description && (
              <p className="collection-description">{collection.description}</p>
            )}
          </div>
        </div>

        {/* Sort dropdown - same styling as search page */}
        <div className="collection-toolbar">
          <div className="collection-product-count">
            {collection.products.nodes.length} products
          </div>
          <div className="collection-sort">
            <label htmlFor="collection-sort-select" className="collection-sort-label">
              Sort by:
            </label>
            <select
              id="collection-sort-select"
              className="search-sort-select"
              value={sortParam}
              onChange={handleSortChange}
            >
              {COLLECTION_SORT_OPTIONS.map((option) => {
                const value = getSortParam(option.key, option.direction);
                return (
                  <option key={value} value={value}>
                    {option.label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      <Pagination connection={collection.products}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <>
            <PreviousLink className="pagination-link">
              {isLoading ? 'Loading...' : <span>Load previous</span>}
            </PreviousLink>
            <ProductsGrid products={nodes} />
            <NextLink className="pagination-link load-more">
              {isLoading ? 'Loading...' : <span>Load more</span>}
            </NextLink>
          </>
        )}
      </Pagination>
    </div>
  );
}

function ProductsGrid({products}: {products: ProductItemFragment[]}) {
  return (
    <div className="products-grid">
      {products.map((product, index) => {
        return (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        );
      })}
    </div>
  );
}

function ProductItem({
  product,
  loading,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="1/1"
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

/**
 * LEARNING: GraphQL Query with Sort Variables
 *
 * Key differences from search query:
 * - Uses ProductCollectionSortKeys enum (not SearchSortKeys)
 * - Default is COLLECTION_DEFAULT (admin-defined order)
 * - More sort options available (BEST_SELLING, TITLE, CREATED)
 *
 * The $sortKey and $reverse variables work the same way:
 * - sortKey: Which field to sort by
 * - reverse: Boolean to flip direction (ASC vs DESC)
 */
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys = COLLECTION_DEFAULT
    $reverse: Boolean = false
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
  }
` as const;
