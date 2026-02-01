import {createContext, useContext, useState, useEffect, type ReactNode} from 'react';
import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  price: {amount: string; currencyCode: string};
  image?: {url: string; altText?: string | null};
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const WISHLIST_STORAGE_KEY = 'hydrogen-wishlist';

export function WishlistProvider({children}: {children: ReactNode}) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load wishlist:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save wishlist:', e);
      }
    }
  }, [items, isLoaded]);

  const addItem = (item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: string) => items.some((item) => item.id === id);

  return (
    <WishlistContext.Provider
      value={{items, addItem, removeItem, isInWishlist, itemCount: items.length}}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

// Heart button to add/remove from wishlist
export function WishlistButton({
  product,
  className = '',
}: {
  product: WishlistItem;
  className?: string;
}) {
  const {addItem, removeItem, isInWishlist} = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  return (
    <button
      className={`wishlist-button ${isWishlisted ? 'active' : ''} ${className}`}
      onClick={handleClick}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isWishlisted ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

// Header icon with count badge
export function WishlistIcon() {
  const {itemCount} = useWishlist();

  return (
    <a href="#wishlist-aside" className="header-wishlist-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {itemCount > 0 && <span className="wishlist-badge">{itemCount}</span>}
    </a>
  );
}

// Wishlist drawer/aside content
export function WishlistDrawer() {
  const {items, removeItem} = useWishlist();

  return (
    <div className="wishlist-drawer">
      {items.length === 0 ? (
        <div className="wishlist-empty">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <p>Your wishlist is empty</p>
          <a href="#" className="wishlist-continue">
            Continue Shopping
          </a>
        </div>
      ) : (
        <ul className="wishlist-items">
          {items.map((item) => (
            <li key={item.id} className="wishlist-item">
              <Link
                to={`/products/${item.handle}`}
                className="wishlist-item-image"
                onClick={() => (window.location.hash = '')}
              >
                {item.image ? (
                  <img src={item.image.url} alt={item.image.altText || item.title} />
                ) : (
                  <div className="wishlist-item-no-image" />
                )}
              </Link>
              <div className="wishlist-item-details">
                <Link
                  to={`/products/${item.handle}`}
                  className="wishlist-item-title"
                  onClick={() => (window.location.hash = '')}
                >
                  {item.title}
                </Link>
                <span className="wishlist-item-price">
                  <Money data={item.price} />
                </span>
              </div>
              <button
                className="wishlist-item-remove"
                onClick={() => removeItem(item.id)}
                aria-label="Remove from wishlist"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
