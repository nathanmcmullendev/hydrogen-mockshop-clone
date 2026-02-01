import {useState} from 'react';
import {useFetcher, Link} from '@remix-run/react';
import {Image, Money, CartForm} from '@shopify/hydrogen';
import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';

interface QuickViewProduct {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      availableForSale: boolean;
      price: {amount: string; currencyCode: string};
      compareAtPrice?: {amount: string; currencyCode: string} | null;
      image?: {
        url: string;
        altText?: string | null;
        width?: number;
        height?: number;
      } | null;
      selectedOptions: Array<{name: string; value: string}>;
    }>;
  };
  options: Array<{name: string; values: string[]}>;
  images: {
    nodes: Array<{
      url: string;
      altText?: string | null;
      width?: number;
      height?: number;
    }>;
  };
  priceRange: {
    minVariantPrice: {amount: string; currencyCode: string};
  };
}

export function ProductQuickView({
  isOpen,
  onClose,
  productHandle,
}: {
  isOpen: boolean;
  onClose: () => void;
  productHandle: string | null;
}) {
  const fetcher = useFetcher<{product: QuickViewProduct}>();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  // Fetch product data when modal opens
  if (isOpen && productHandle && fetcher.state === 'idle' && !fetcher.data) {
    fetcher.load(`/api/product-quickview?handle=${productHandle}`);
  }

  // Reset state when modal closes
  const handleClose = () => {
    setSelectedOptions({});
    setQuantity(1);
    onClose();
  };

  if (!isOpen) return null;

  const product = fetcher.data?.product;
  const isLoading = fetcher.state === 'loading' || !product;

  // Find selected variant based on selected options
  const selectedVariant = product?.variants.nodes.find((variant) =>
    variant.selectedOptions.every(
      (opt) => selectedOptions[opt.name] === opt.value || !selectedOptions[opt.name]
    )
  ) || product?.variants.nodes[0];

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({...prev, [optionName]: value}));
  };

  return (
    <div className="quickview-overlay" onClick={handleClose}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close" onClick={handleClose} aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        {isLoading ? (
          <div className="quickview-loading">
            <div className="quickview-spinner" />
          </div>
        ) : product ? (
          <div className="quickview-content">
            <div className="quickview-image">
              {selectedVariant?.image ? (
                <Image
                  data={selectedVariant.image}
                  aspectRatio="1/1"
                  sizes="400px"
                />
              ) : product.images.nodes[0] ? (
                <Image
                  data={product.images.nodes[0]}
                  aspectRatio="1/1"
                  sizes="400px"
                />
              ) : (
                <div className="quickview-no-image">No image</div>
              )}
            </div>

            <div className="quickview-details">
              <h2 className="quickview-title">{product.title}</h2>

              <div className="quickview-price">
                {selectedVariant?.compareAtPrice ? (
                  <>
                    <span className="quickview-price-sale">
                      <Money data={selectedVariant.price} />
                    </span>
                    <s className="quickview-price-compare">
                      <Money data={selectedVariant.compareAtPrice} />
                    </s>
                  </>
                ) : (
                  <Money data={selectedVariant?.price || product.priceRange.minVariantPrice} />
                )}
              </div>

              {/* Variant Options */}
              {product.options.map((option) => (
                <div key={option.name} className="quickview-option">
                  <label className="quickview-option-label">{option.name}</label>
                  <div className="quickview-option-values">
                    {option.values.map((value) => (
                      <button
                        key={value}
                        className={`quickview-option-btn ${
                          (selectedOptions[option.name] || product.variants.nodes[0]?.selectedOptions.find(o => o.name === option.name)?.value) === value
                            ? 'active'
                            : ''
                        }`}
                        onClick={() => handleOptionChange(option.name, value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className="quickview-quantity">
                <label className="quickview-quantity-label">Quantity</label>
                <div className="quickview-quantity-selector">
                  <button
                    type="button"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => setQuantity(quantity + 1)}>
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <CartForm
                route="/cart"
                inputs={{
                  lines: selectedVariant
                    ? [{merchandiseId: selectedVariant.id, quantity}]
                    : [],
                }}
                action={CartForm.ACTIONS.LinesAdd}
              >
                <button
                  type="submit"
                  className="quickview-add-to-cart"
                  disabled={!selectedVariant?.availableForSale}
                  onClick={() => {
                    setTimeout(() => {
                      handleClose();
                      window.location.hash = '#cart-aside';
                    }, 300);
                  }}
                >
                  {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
                </button>
              </CartForm>

              {/* View Full Details Link */}
              <Link
                to={`/products/${product.handle}`}
                className="quickview-view-details"
                onClick={handleClose}
              >
                View Full Details
              </Link>
            </div>
          </div>
        ) : (
          <div className="quickview-error">Product not found</div>
        )}
      </div>
    </div>
  );
}

export function QuickViewButton({
  productHandle,
  onQuickView,
}: {
  productHandle: string;
  onQuickView: (handle: string) => void;
}) {
  return (
    <button
      className="quickview-trigger"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onQuickView(productHandle);
      }}
      aria-label="Quick view"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      <span>Quick View</span>
    </button>
  );
}
