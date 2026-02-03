/**
 * Integration Tests
 *
 * Tests for complete user flows that span multiple components.
 * These tests verify that components work together correctly.
 */
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {render, screen, waitFor, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {WishlistProvider, useWishlist, WishlistButton, WishlistIcon} from '~/components/Wishlist';
import {createSimpleMockProduct, resetMockCounters} from './mocks';
import type {ReactNode} from 'react';

// ============================================
// WISHLIST FLOW TESTS
// ============================================

describe('Wishlist Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    resetMockCounters();
  });

  describe('add to wishlist flow', () => {
    it('completes full add-to-wishlist flow', async () => {
      const user = userEvent.setup();
      const product = createSimpleMockProduct({
        id: 'test-product-1',
        title: 'Test Product',
      });

      // Test component that uses wishlist
      function TestComponent() {
        const {items, itemCount} = useWishlist();
        return (
          <div>
            <WishlistButton product={product} />
            <WishlistIcon />
            <div data-testid="item-count">{itemCount}</div>
            <ul data-testid="wishlist-items">
              {items.map((item) => (
                <li key={item.id}>{item.title}</li>
              ))}
            </ul>
          </div>
        );
      }

      render(
        <WishlistProvider>
          <TestComponent />
        </WishlistProvider>,
      );

      // Initially empty
      expect(screen.getByTestId('item-count')).toHaveTextContent('0');

      // Click add button
      const addButton = screen.getByRole('button', {name: /add to wishlist/i});
      await user.click(addButton);

      // Item should be added
      await waitFor(() => {
        expect(screen.getByTestId('item-count')).toHaveTextContent('1');
      });

      // Item should appear in list
      expect(screen.getByText('Test Product')).toBeInTheDocument();

      // Button should now show remove
      expect(screen.getByRole('button', {name: /remove from wishlist/i})).toBeInTheDocument();
    });

    it('removes item from wishlist when clicked again', async () => {
      const user = userEvent.setup();
      const product = createSimpleMockProduct();

      function TestComponent() {
        const {itemCount} = useWishlist();
        return (
          <div>
            <WishlistButton product={product} />
            <div data-testid="count">{itemCount}</div>
          </div>
        );
      }

      render(
        <WishlistProvider>
          <TestComponent />
        </WishlistProvider>,
      );

      // Add item
      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('1');
      });

      // Remove item
      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('0');
      });
    });
  });

  describe('wishlist persistence', () => {
    it('persists wishlist across remounts', async () => {
      const user = userEvent.setup();
      const product = createSimpleMockProduct({id: 'persist-test'});

      function WishlistDisplay() {
        const {items} = useWishlist();
        return <div data-testid="items">{items.map((i) => i.id).join(',')}</div>;
      }

      // First render - add item
      const {unmount} = render(
        <WishlistProvider>
          <WishlistButton product={product} />
          <WishlistDisplay />
        </WishlistProvider>,
      );

      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByTestId('items')).toHaveTextContent('persist-test');
      });

      // Unmount
      unmount();

      // Remount - item should still be there
      render(
        <WishlistProvider>
          <WishlistDisplay />
        </WishlistProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('items')).toHaveTextContent('persist-test');
      });
    });

    it('syncs across multiple components', async () => {
      const user = userEvent.setup();
      const product = createSimpleMockProduct();

      function WishlistCounter() {
        const {itemCount} = useWishlist();
        return <span data-testid="counter">{itemCount}</span>;
      }

      render(
        <WishlistProvider>
          <WishlistCounter />
          <WishlistButton product={product} />
          <WishlistCounter />
        </WishlistProvider>,
      );

      // Both counters should start at 0
      const counters = screen.getAllByTestId('counter');
      expect(counters[0]).toHaveTextContent('0');
      expect(counters[1]).toHaveTextContent('0');

      // Add item
      await user.click(screen.getByRole('button'));

      // Both counters should update
      await waitFor(() => {
        const countersAfter = screen.getAllByTestId('counter');
        expect(countersAfter[0]).toHaveTextContent('1');
        expect(countersAfter[1]).toHaveTextContent('1');
      });
    });
  });

  describe('multiple products', () => {
    it('handles adding multiple different products', async () => {
      const user = userEvent.setup();
      const product1 = createSimpleMockProduct({id: 'prod-1', title: 'Product 1'});
      const product2 = createSimpleMockProduct({id: 'prod-2', title: 'Product 2'});

      function TestComponent() {
        const {items} = useWishlist();
        return (
          <div>
            <WishlistButton product={product1} />
            <WishlistButton product={product2} />
            <ul data-testid="items">
              {items.map((i) => (
                <li key={i.id}>{i.title}</li>
              ))}
            </ul>
          </div>
        );
      }

      render(
        <WishlistProvider>
          <TestComponent />
        </WishlistProvider>,
      );

      const buttons = screen.getAllByRole('button');

      // Add both products
      await user.click(buttons[0]);
      await user.click(buttons[1]);

      await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
      });
    });

    it('prevents duplicate additions', async () => {
      const user = userEvent.setup();
      const product = createSimpleMockProduct({id: 'dup-test'});

      function DuplicateButtons() {
        const {itemCount, addItem} = useWishlist();
        return (
          <div>
            <button onClick={() => addItem(product)}>Add 1</button>
            <button onClick={() => addItem(product)}>Add 2</button>
            <span data-testid="count">{itemCount}</span>
          </div>
        );
      }

      render(
        <WishlistProvider>
          <DuplicateButtons />
        </WishlistProvider>,
      );

      // Click both buttons
      await user.click(screen.getByRole('button', {name: 'Add 1'}));
      await user.click(screen.getByRole('button', {name: 'Add 2'}));

      // Should only have 1 item
      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('1');
      });
    });
  });
});

// ============================================
// COMPONENT INTERACTION TESTS
// ============================================

describe('Component Interactions', () => {
  describe('keyboard navigation', () => {
    it('supports keyboard interaction on buttons', async () => {
      const user = userEvent.setup();
      const product = createSimpleMockProduct();

      render(
        <WishlistProvider>
          <WishlistButton product={product} />
        </WishlistProvider>,
      );

      const button = screen.getByRole('button');

      // Tab to button
      await user.tab();
      expect(button).toHaveFocus();

      // Press Enter to activate
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-label', 'Remove from wishlist');
      });
    });
  });

  describe('error handling', () => {
    it('handles corrupted localStorage gracefully', async () => {
      // Corrupt localStorage
      localStorage.setItem('hydrogen-wishlist', 'not valid json {{{');

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      function TestComponent() {
        const {items} = useWishlist();
        return <div data-testid="count">{items.length}</div>;
      }

      render(
        <WishlistProvider>
          <TestComponent />
        </WishlistProvider>,
      );

      // Should handle gracefully and start with empty list
      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('0');
      });

      consoleSpy.mockRestore();
    });
  });
});
