import {json, type LoaderArgs} from '@shopify/remix-oxygen';

export async function loader({request, context}: LoaderArgs) {
  const url = new URL(request.url);
  const handle = url.searchParams.get('handle');

  if (!handle) {
    return json({error: 'Product handle is required'}, {status: 400});
  }

  const {storefront} = context;

  const {product} = await storefront.query(QUICKVIEW_PRODUCT_QUERY, {
    variables: {handle},
  });

  if (!product) {
    return json({error: 'Product not found'}, {status: 404});
  }

  return json({product});
}

const QUICKVIEW_PRODUCT_QUERY = `#graphql
  query QuickViewProduct(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      options {
        name
        values
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        nodes {
          url
          altText
          width
          height
        }
      }
      variants(first: 50) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            url
            altText
            width
            height
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
` as const;
