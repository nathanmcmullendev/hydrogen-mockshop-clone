import React, {Suspense, useState} from 'react';
import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {defer, redirect, type LoaderArgs} from '@shopify/remix-oxygen';
import type {FetcherWithComponents} from '@remix-run/react';
import {Await, Link, useLoaderData} from '@remix-run/react';
import type {
  ProductFragment,
  ProductVariantsQuery,
  ProductVariantFragment,
} from 'storefrontapi.generated';

import {
  Money,
  VariantSelector,
  type VariantOption,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl} from '~/utils';
import {
  getOptimizedImageUrl,
  getSrcSet,
  getSizes,
  IMAGE_SIZES,
} from '~/utils/images';

export const meta: V2_MetaFunction = ({data}) => {
  return [{title: `Mock.shop | ${data?.product?.title ?? 'Product'}`}];
};

export async function loader({params, request, context}: LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option) => option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      return redirectToFirstVariant({product, request});
    }
  }
  return defer({product, variants});
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  throw redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const {product, variants} = useLoaderData<typeof loader>();
  const {selectedVariant} = product;
  return (
    <div className="product-page">
      <div className="product-gallery">
        <ProductImage image={selectedVariant?.image} />
      </div>
      <div className="product-info">
        <ProductMain
          selectedVariant={selectedVariant}
          product={product}
          variants={variants}
        />
      </div>
    </div>
  );
}

function ProductImage({image}: {image: ProductVariantFragment['image']}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!image) {
    return <div className="product-image" />;
  }

  // Generate Cloudinary optimized URLs
  const imageUrl = image.url;
  const imageSrc = getOptimizedImageUrl(imageUrl, IMAGE_SIZES.preview);
  const imageSrcSet = getSrcSet(imageUrl, [400, 600, 800, 1200]);
  const imageSizes = getSizes({
    '(max-width: 640px)': '100vw',
    '(max-width: 1024px)': '50vw',
    default: '50vw',
  });
  // Full resolution for lightbox
  const lightboxUrl = getOptimizedImageUrl(imageUrl, IMAGE_SIZES.full);

  return (
    <>
      <div className="product-image">
        <button
          className="product-image-zoom"
          aria-label="Zoom image"
          onClick={() => setIsZoomed(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
            <path d="M11 8v6"></path>
            <path d="M8 11h6"></path>
          </svg>
        </button>
        <img
          src={imageSrc}
          srcSet={imageSrcSet}
          sizes={imageSizes}
          alt={image.altText || 'Product Image'}
          loading="eager"
          fetchPriority="high"
          width={800}
          height={800}
          onLoad={() => setIsLoaded(true)}
          className={`product-main-image ${isLoaded ? 'loaded' : ''}`}
          style={{aspectRatio: '1/1', objectFit: 'cover', width: '100%'}}
        />
        <div className="product-image-pagination">
          <button className="pagination-arrow" disabled aria-label="Previous image">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <span className="pagination-indicator">1/1</span>
          <button className="pagination-arrow" disabled aria-label="Next image">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Image Zoom Lightbox */}
      {isZoomed && (
        <div
          className="product-lightbox"
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed product image"
        >
          <button
            className="product-lightbox-close"
            onClick={() => setIsZoomed(false)}
            aria-label="Close zoom"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
          <div className="product-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxUrl}
              alt={image.altText || 'Product Image'}
              className="product-lightbox-image"
            />
          </div>
        </div>
      )}
    </>
  );
}

function ProductMain({
  selectedVariant,
  product,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
}) {
  const {title, descriptionHtml} = product;
  return (
    <div className="product-main">
      <h1>{title}</h1>
      <ProductPrice selectedVariant={selectedVariant} />
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
            />
          )}
        </Await>
      </Suspense>
      <div className="product-description">
        <details open>
          <summary>Description</summary>
          <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
        </details>
      </div>
    </div>
  );
}

function ProductPrice({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  return (
    <div className="product-price">
      {selectedVariant?.compareAtPrice ? (
        <div className="product-price-on-sale">
          <span className="product-price-sale">
            <Money data={selectedVariant.price} />
          </span>
          <s className="product-price-compare">
            <Money data={selectedVariant.compareAtPrice} />
          </s>
          <span className="product-sale-badge">Sale</span>
        </div>
      ) : (
        selectedVariant?.price && (
          <span className="product-price-regular">
            <Money data={selectedVariant?.price} />
          </span>
        )
      )}
      <p className="product-shipping-notice">
        Shipping calculated at checkout.
      </p>
    </div>
  );
}

function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  const [quantity, setQuantity] = React.useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="product-form">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>

      <div className="product-quantity">
        <label className="product-quantity-label">Quantity</label>
        <div className="product-quantity-selector">
          <button
            type="button"
            className="quantity-btn"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="quantity-value">{quantity}</span>
          <button
            type="button"
            className="quantity-btn"
            onClick={increaseQuantity}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          window.location.href = window.location.href + '#cart-aside';
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: quantity,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  const isColorOption = option.name.toLowerCase() === 'color';
  const activeValue = option.values.find((v) => v.isActive)?.value;

  // Color name to hex mapping
  const colorMap: Record<string, string> = {
    green: '#2d5a27',
    olive: '#808000',
    ocean: '#006994',
    purple: '#663399',
    red: '#8b3a3a',
    black: '#000000',
    white: '#ffffff',
    blue: '#0066cc',
    gray: '#808080',
    grey: '#808080',
    navy: '#000080',
    pink: '#ffc0cb',
    orange: '#ff8c00',
    yellow: '#ffd700',
    brown: '#8b4513',
    beige: '#f5f5dc',
  };

  if (isColorOption) {
    return (
      <div className="product-options product-options-color" key={option.name}>
        <label className="product-options-label">
          {option.name} : {activeValue}
        </label>
        <div className="product-color-swatches">
          {option.values.map(({value, isAvailable, isActive, to}) => {
            const colorHex = colorMap[value.toLowerCase()] || '#cccccc';
            return (
              <Link
                className={`product-color-swatch ${isActive ? 'active' : ''} ${!isAvailable ? 'unavailable' : ''}`}
                key={option.name + value}
                prefetch="intent"
                preventScrollReset
                replace
                to={to}
                title={value}
              >
                <span
                  className="swatch-color"
                  style={{backgroundColor: colorHex}}
                />
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="product-options" key={option.name}>
      <label className="product-options-label">{option.name}</label>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className={`product-options-item ${isActive ? 'active' : ''} ${!isAvailable ? 'unavailable' : ''}`}
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
            >
              {value}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: CartLineInput[];
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
