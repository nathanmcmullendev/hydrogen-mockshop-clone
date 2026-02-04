import {useState} from 'react';
import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, useSearchParams, useSubmit} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Money,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/utils';
import {WishlistButton} from '~/components/Wishlist';
import {ProductQuickView, QuickViewButton} from '~/components/ProductQuickView';
import {
  getOptimizedImageUrl,
  getSrcSet,
  getSizes,
  IMAGE_SIZES,
} from '~/utils/images';

/**
 * All Products Page
 *
 * This page shows all products in the store, similar to /collections/all
 * but without requiring a collection to exist in Shopify.
 */

// Sort options for all products
export const PRODUCT_SORT_OPTIONS = [
  {key: 'RELEVANCE', label: 'Featured', direction: null},
  {key: 'BEST_SELLING', label: 'Best Selling', direction: null},
  {key: 'CREATED_AT', label: 'Newest', direction: 'DESC'},
  {key: 'PRICE', label: 'Price: Low to High', direction: 'ASC'},
  {key: 'PRICE', label: 'Price: High to Low', direction: 'DESC'},
  {key: 'TITLE', label: 'Alphabetically: A-Z', direction: 'ASC'},
  {key: 'TITLE', label: 'Alphabetically: Z-A', direction: 'DESC'},
] as const;

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

export const meta: V2_MetaFunction = () => {
  return [{title: 'Mock.shop | All Products'}];
};

export async function loader({request, context}: LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  // Extract sort from URL params
  const url = new URL(request.url);
  const sortParam = url.searchParams.get('sort') || 'RELEVANCE';
  const {key: sortKey, reverse} = parseSortParam(sortParam);

  const {products} = await storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      sortKey,
      reverse,
      ...paginationVariables,
    },
  });

  return json({products, sortParam});
}

export default function AllProducts() {
  const {products, sortParam} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const [quickViewHandle, setQuickViewHandle] = useState<string | null>(null);

  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', event.target.value);
    newParams.delete('cursor');
    newParams.delete('direction');
    submit(newParams, {method: 'get'});
  }

  return (
    <div className="collection-page">
      <div className="collection-header">
        <div className="collection-header-top">
          <div>
            <h1>All Products</h1>
            <p className="collection-description">Browse our complete catalog</p>
          </div>
        </div>

        <div className="collection-toolbar">
          <div className="collection-product-count">
            {products.nodes.length} products
          </div>
          <div className="collection-sort">
            <label htmlFor="products-sort-select" className="collection-sort-label">
              Sort by:
            </label>
            <select
              id="products-sort-select"
              className="search-sort-select"
              value={sortParam}
              onChange={handleSortChange}
            >
              {PRODUCT_SORT_OPTIONS.map((option) => {
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

      <Pagination connection={products}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <>
            <PreviousLink className="pagination-link">
              {isLoading ? 'Loading...' : <span>Load previous</span>}
            </PreviousLink>
            <ProductsGrid products={nodes} onQuickView={setQuickViewHandle} />
            <NextLink className="pagination-link load-more">
              {isLoading ? 'Loading...' : <span>Load more</span>}
            </NextLink>
          </>
        )}
      </Pagination>

      <ProductQuickView
        isOpen={!!quickViewHandle}
        onClose={() => setQuickViewHandle(null)}
        productHandle={quickViewHandle}
      />
    </div>
  );
}

function ProductsGrid({
  products,
  onQuickView,
}: {
  products: ProductItemFragment[];
  onQuickView: (handle: string) => void;
}) {
  return (
    <div className="products-grid">
      {products.map((product, index) => {
        return (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
            onQuickView={onQuickView}
          />
        );
      })}
    </div>
  );
}

/**
 * ProductItem - Optimized product card with Cloudinary images
 *
 * Features:
 * - Native <img> with srcset for responsive loading
 * - Priority loading for above-fold images
 * - fetchpriority hint for browser scheduling
 * - Image reveal animation
 */
function ProductItem({
  product,
  loading,
  onQuickView,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
  onQuickView: (handle: string) => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  const priority = loading === 'eager';

  // Generate optimized image URLs via Cloudinary
  const imageUrl = product.featuredImage?.url;
  const imageSrc = imageUrl
    ? getOptimizedImageUrl(imageUrl, IMAGE_SIZES.thumbnail)
    : '';
  const imageSrcSet = imageUrl
    ? getSrcSet(imageUrl, [200, 400, 600, 800])
    : '';
  const imageSizes = getSizes({
    '(max-width: 640px)': '50vw',
    '(max-width: 1024px)': '33vw',
    default: '25vw',
  });

  return (
    <div className="product-item-wrapper">
      <div className="product-item-image-container">
        <Link
          className="product-item"
          key={product.id}
          prefetch="intent"
          to={variantUrl}
        >
          {imageUrl ? (
            <img
              src={imageSrc}
              srcSet={imageSrcSet}
              sizes={imageSizes}
              alt={product.featuredImage?.altText || product.title}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              width={400}
              height={400}
              onLoad={() => setIsLoaded(true)}
              className={`product-image ${isLoaded ? 'loaded' : ''}`}
              style={{aspectRatio: '1/1', objectFit: 'cover'}}
            />
          ) : (
            <div className="product-image-placeholder" />
          )}
        </Link>
        <WishlistButton
          product={{
            id: product.id,
            handle: product.handle,
            title: product.title,
            price: product.priceRange.minVariantPrice,
            image: product.featuredImage,
          }}
        />
        <QuickViewButton
          productHandle={product.handle}
          onQuickView={onQuickView}
        />
      </div>
      <Link to={variantUrl} className="product-item-info">
        <h4>{product.title}</h4>
        <small>
          <Money data={product.priceRange.minVariantPrice} />
        </small>
      </Link>
    </div>
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

const ALL_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductSortKeys = RELEVANCE
    $reverse: Boolean = false
  ) @inContext(country: $country, language: $language) {
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
` as const;
