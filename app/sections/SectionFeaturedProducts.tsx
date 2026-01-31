import {Money, Image} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';

/**
 * Featured Products section driven by Shopify Metaobjects.
 *
 * Metaobject Definition (create in Shopify Admin):
 * Type: section_featured_products
 * Fields:
 *   - label (Single line text) - e.g., "New arrivals"
 *   - heading (Single line text) - e.g., "Spring '23"
 *   - products (Product reference - List)
 *   - show_prices (True/false)
 */
export function SectionFeaturedProducts(props: SectionFeaturedProductsFragment) {
  const section = parseSection<
    SectionFeaturedProductsFragment,
    {
      label?: ParsedMetafields['single_line_text_field'];
      heading?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {label, heading, products, show_prices} = section;
  const showPrices = show_prices?.value === 'true';

  return (
    <section className="new-arrivals">
      <div className="new-arrivals-header">
        {label?.parsedValue && (
          <p className="new-arrivals-label">{label.parsedValue}</p>
        )}
        {heading?.parsedValue && (
          <h2 className="new-arrivals-title">{heading.parsedValue}</h2>
        )}
      </div>
      {products?.nodes && (
        <div className="new-arrivals-grid">
          {products.nodes.map((product) => {
            const variant = product.variants?.nodes?.[0];
            return (
              <Link
                key={product.id}
                className="new-arrivals-product"
                to={`/products/${product.handle}`}
              >
                {variant?.image && (
                  <Image
                    data={variant.image}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                )}
                <h4>{product.title}</h4>
                {showPrices && (
                  <small>
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

// TypeScript interface
export interface SectionFeaturedProductsFragment {
  type: string;
  id?: string;
  label?: {
    key: string;
    value: string;
    type?: string;
  };
  heading?: {
    key: string;
    value: string;
    type?: string;
  };
  show_prices?: {
    key: string;
    value: string;
    type?: string;
  };
  products?: {
    references?: {
      nodes: Array<{
        id: string;
        title: string;
        handle: string;
        variants?: {
          nodes: Array<{
            image?: {
              altText?: string;
              width?: number;
              height?: number;
              url: string;
            };
          }>;
        };
        priceRange: {
          minVariantPrice: {
            amount: string;
            currencyCode: string;
          };
        };
      }>;
    };
  };
}

const FEATURED_PRODUCT_FRAGMENT = `#graphql
  fragment SectionFeaturedProduct on Product {
    id
    title
    handle
    variants(first: 1) {
      nodes {
        image {
          altText
          width
          height
          url
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

export const SECTION_FEATURED_PRODUCTS_FRAGMENT = `#graphql
  fragment SectionFeaturedProducts on Metaobject {
    type
    id
    label: field(key: "label") {
      key
      value
      type
    }
    heading: field(key: "heading") {
      key
      value
      type
    }
    show_prices: field(key: "show_prices") {
      key
      value
      type
    }
    products: field(key: "products") {
      references(first: 12) {
        nodes {
          ... on Product {
            ...SectionFeaturedProduct
          }
        }
      }
    }
  }
  ${FEATURED_PRODUCT_FRAGMENT}
`;
