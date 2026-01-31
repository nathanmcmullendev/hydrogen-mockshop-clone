import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, Form} from '@remix-run/react';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';

export const meta: V2_MetaFunction = () => {
  return [{title: `Mock.shop | Search`}];
};

export async function loader({request, context}: LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const variables = getPaginationVariables(request, {pageBy: 8});
  const searchTerm = String(searchParams.get('q') || '');

  if (!searchTerm) {
    return {
      searchResults: {results: null, totalResults: 0},
      searchTerm,
    };
  }

  const data = await context.storefront.query(SEARCH_QUERY, {
    variables: {
      query: searchTerm,
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

  return defer({searchTerm, searchResults});
}

export default function SearchPage() {
  const {searchTerm, searchResults} = useLoaderData<typeof loader>();
  const products = searchResults.results?.products?.nodes || [];

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
            <span className="search-filter-label">Filter:</span>
            <button className="search-filter-btn">
              Availability
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
          </div>
          <div className="search-filters-right">
            <span className="search-filter-label">Sort by:</span>
            <button className="search-filter-btn">
              Relevance
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
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
  ) @inContext(country: $country, language: $language) {
    products: search(
      query: $query,
      unavailableProducts: HIDE,
      types: [PRODUCT],
      first: $first,
      sortKey: RELEVANCE,
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
