/**
 * LEARNING: Testing React Context + localStorage
 *
 * This test file demonstrates several key patterns:
 * 1. Testing React Context providers
 * 2. Testing hooks with renderHook()
 * 3. Mocking/testing localStorage interactions
 * 4. Testing component behavior with user events
 *
 * Context testing is tricky because:
 * - Hooks can only be called inside components
 * - We need to wrap tests in the Provider
 * - State updates are async
 */
import {describe, it, expect, beforeEach, vi} from 'vitest';
import {render, screen, renderHook, act, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  WishlistProvider,
  useWishlist,
  WishlistButton,
  WishlistIcon,
} from './Wishlist';
import type {ReactNode} from 'react';

/**
 * LEARNING: Test Data Factories
 *
 * Create helper functions to generate test data.
 * This makes tests more readable and reduces duplication.
 * Change the factory once, all tests update.
 */
function createMockProduct(overrides = {}) {
  return {
    id: 'gid://shopify/Product/123',
    handle: 'test-product',
    title: 'Test Product',
    price: {amount: '29.99', currencyCode: 'USD'},
    image: {url: 'https://example.com/image.jpg', altText: 'Test image'},
    ...overrides,
  };
}

/**
 * LEARNING: Wrapper Component for Context Tests
 *
 * When testing hooks that require context, wrap them in the Provider.
 * This is a common pattern - create a reusable wrapper.
 */
function Wrapper({children}: {children: ReactNode}) {
  return <WishlistProvider>{children}</WishlistProvider>;
}

describe('Wishlist', () => {
  /**
   * LEARNING: beforeEach for Test Isolation
   *
   * Clear localStorage before each test to prevent pollution.
   * Each test should start with a clean slate.
   */
  beforeEach(() => {
    localStorage.clear();
  });

  describe('useWishlist hook', () => {
    it('throws error when used outside Provider', () => {
      /**
       * LEARNING: Testing Error Throws
       *
       * Wrap the error-throwing code in a function for expect().toThrow()
       * Console.error is mocked to suppress React's error boundary logs
       */
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useWishlist());
      }).toThrow('useWishlist must be used within a WishlistProvider');

      consoleSpy.mockRestore();
    });

    it('starts with empty wishlist', () => {
      const {result} = renderHook(() => useWishlist(), {wrapper: Wrapper});

      expect(result.current.items).toEqual([]);
      expect(result.current.itemCount).toBe(0);
    });

    it('adds item to wishlist', async () => {
      const {result} = renderHook(() => useWishlist(), {wrapper: Wrapper});
      const product = createMockProduct();

      /**
       * LEARNING: act() for State Updates
       *
       * React state updates are async. Wrap them in act() to ensure
       * the component finishes updating before assertions.
       */
      act(() => {
        result.current.addItem(product);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe(product.id);
      expect(result.current.itemCount).toBe(1);
    });

    it('does not add duplicate items', () => {
      const {result} = renderHook(() => useWishlist(), {wrapper: Wrapper});
      const product = createMockProduct();

      act(() => {
        result.current.addItem(product);
        result.current.addItem(product); // Try to add same item again
      });

      expect(result.current.items).toHaveLength(1);
    });

    it('removes item from wishlist', () => {
      const {result} = renderHook(() => useWishlist(), {wrapper: Wrapper});
      const product = createMockProduct();

      act(() => {
        result.current.addItem(product);
      });

      expect(result.current.items).toHaveLength(1);

      act(() => {
        result.current.removeItem(product.id);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('isInWishlist returns correct value', () => {
      const {result} = renderHook(() => useWishlist(), {wrapper: Wrapper});
      const product = createMockProduct();

      expect(result.current.isInWishlist(product.id)).toBe(false);

      act(() => {
        result.current.addItem(product);
      });

      expect(result.current.isInWishlist(product.id)).toBe(true);
    });
  });

  describe('localStorage persistence', () => {
    it('saves items to localStorage', async () => {
      const {result} = renderHook(() => useWishlist(), {wrapper: Wrapper});
      const product = createMockProduct();

      act(() => {
        result.current.addItem(product);
      });

      /**
       * LEARNING: waitFor for Async Effects
       *
       * localStorage save happens in useEffect, which is async.
       * Use waitFor() to wait for the assertion to pass.
       */
      await waitFor(() => {
        const stored = localStorage.getItem('hydrogen-wishlist');
        expect(stored).not.toBeNull();
        expect(JSON.parse(stored!)).toHaveLength(1);
      });
    });

    it('loads items from localStorage on mount', async () => {
      // Pre-populate localStorage
      const product = createMockProduct();
      localStorage.setItem('hydrogen-wishlist', JSON.stringify([product]));

      const {result} = renderHook(() => useWishlist(), {wrapper: Wrapper});

      /**
       * LEARNING: Waiting for Initial Load
       *
       * The hook loads from localStorage in useEffect (after mount).
       * We need to wait for this to complete.
       */
      await waitFor(() => {
        expect(result.current.items).toHaveLength(1);
      });
    });

    it('handles corrupted localStorage gracefully', async () => {
      // Put invalid JSON in localStorage
      localStorage.setItem('hydrogen-wishlist', 'not valid json');

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const {result} = renderHook(() => useWishlist(), {wrapper: Wrapper});

      // Should start with empty array, not crash
      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      consoleSpy.mockRestore();
    });
  });

  describe('WishlistButton component', () => {
    /**
     * LEARNING: Component Rendering Tests
     *
     * These tests verify:
     * 1. Component renders without crashing
     * 2. Correct aria-labels for accessibility
     * 3. Click behavior updates state
     */
    it('renders with "Add to wishlist" label when not in wishlist', () => {
      const product = createMockProduct();

      render(
        <Wrapper>
          <WishlistButton product={product} />
        </Wrapper>
      );

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Add to wishlist'
      );
    });

    it('toggles wishlist state on click', async () => {
      const product = createMockProduct();
      const user = userEvent.setup();

      render(
        <Wrapper>
          <WishlistButton product={product} />
        </Wrapper>
      );

      const button = screen.getByRole('button');

      // Initially not in wishlist
      expect(button).toHaveAttribute('aria-label', 'Add to wishlist');

      // Click to add
      await user.click(button);

      // Now in wishlist
      expect(button).toHaveAttribute('aria-label', 'Remove from wishlist');
    });
  });

  describe('WishlistIcon component', () => {
    it('renders without badge when wishlist is empty', () => {
      render(
        <Wrapper>
          <WishlistIcon />
        </Wrapper>
      );

      // Badge should not be present
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('shows badge with count when items exist', async () => {
      const product = createMockProduct();
      localStorage.setItem('hydrogen-wishlist', JSON.stringify([product]));

      render(
        <Wrapper>
          <WishlistIcon />
        </Wrapper>
      );

      // Wait for localStorage load
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
      });
    });
  });
});
