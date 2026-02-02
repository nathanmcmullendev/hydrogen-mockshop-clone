import {useState, useEffect, useRef} from 'react';
import {useFetcher, Link, useRevalidator} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
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
  const productFetcher = useFetcher<{product: QuickViewProduct}>();
  const cartFetcher = useFetcher();
  const revalidator = useRevalidator();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const lastFetchedHandle = useRef<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Fetch product data when modal opens or product handle changes
  useEffect(() => {
    if (isOpen && productHandle && productHandle !== lastFetchedHandle.current) {
      lastFetchedHandle.current = productHandle;
      setSelectedOptions({});
      setQuantity(1);
      setIsAddingToCart(false);
      productFetcher.load(`/api/product-quickview?handle=${productHandle}`);
    }
  }, [isOpen, productHandle]);

  // Handle cart submission completion
  useEffect(() => {
    if (isAddingToCart && cartFetcher.state === 'idle' && cartFetcher.data) {
      // Cart submission completed - revalidate to get fresh cart data
      revalidator.revalidate();
      // Close modal and open cart drawer
      onClose();
      lastFetchedHandle.current = null;
      setSelectedOptions({});
      setQuantity(1);
      setIsAddingToCart(false);
      // Small delay to ensure revalidation starts before opening cart
      setTimeout(() => {
        window.location.hash = '#cart-aside';
      }, 100);
    }
  }, [cartFetcher.state, cartFetcher.data, isAddingToCart, revalidator, onClose]);

  // Reset tracking when modal closes
  const handleClose = () => {
    lastFetchedHandle.current = null;
    setSelectedOptions({});
    setQuantity(1);
    onClose();
  };

  if (!isOpen) return null;

  const product = productFetcher.data?.product;
  const isLoading = productFetcher.state === 'loading' || !product;

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
              <button
                type="button"
                className="quickview-add-to-cart"
                disabled={!selectedVariant?.availableForSale || isAddingToCart}
                onClick={() => {
                  if (!selectedVariant) return;
                  setIsAddingToCart(true);
                  const formData = new FormData();
                  formData.append('cartAction', 'ADD_TO_CART');
                  formData.append(
                    'lines',
                    JSON.stringify([{merchandiseId: selectedVariant.id, quantity}])
                  );
                  cartFetcher.submit(formData, {
                    method: 'POST',
                    action: '/cart',
                  });
                }}
              >
                {isAddingToCart
                  ? 'Adding...'
                  : selectedVariant?.availableForSale
                  ? 'Add to Cart'
                  : 'Sold Out'}
              </button>

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
