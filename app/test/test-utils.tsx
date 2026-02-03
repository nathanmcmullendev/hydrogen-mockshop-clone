/**
 * Custom Test Utilities
 *
 * This file provides custom render functions that wrap components
 * with necessary providers. Use these instead of @testing-library/react's
 * render when testing components that need context.
 *
 * LEARNING: Custom Render Functions
 * - Wrap components with providers they need (Router, Context, etc.)
 * - Keep render options flexible for different test scenarios
 * - Export everything from @testing-library/react for convenience
 */
import {render, type RenderOptions} from '@testing-library/react';
import type {ReactElement, ReactNode} from 'react';
import {MemoryRouter} from 'react-router-dom';
import {WishlistProvider} from '~/components/Wishlist';

// ============================================
// PROVIDER WRAPPER
// ============================================

interface WrapperProps {
  children: ReactNode;
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Initial route entries for MemoryRouter */
  initialEntries?: string[];
  /** Whether to include WishlistProvider */
  withWishlist?: boolean;
  /** Whether to include MemoryRouter */
  withRouter?: boolean;
}

/**
 * Creates a wrapper component with configurable providers
 */
function createWrapper(options: CustomRenderOptions = {}) {
  const {initialEntries = ['/'], withWishlist = true, withRouter = true} = options;

  return function Wrapper({children}: WrapperProps) {
    let wrapped = children;

    // Wrap with WishlistProvider if needed
    if (withWishlist) {
      wrapped = <WishlistProvider>{wrapped}</WishlistProvider>;
    }

    // Wrap with MemoryRouter if needed
    if (withRouter) {
      wrapped = <MemoryRouter initialEntries={initialEntries}>{wrapped}</MemoryRouter>;
    }

    return <>{wrapped}</>;
  };
}

// ============================================
// CUSTOM RENDER FUNCTION
// ============================================

/**
 * Custom render function that wraps components with providers
 *
 * @example
 * ```tsx
 * // Basic usage - includes Router and WishlistProvider
 * renderWithProviders(<MyComponent />);
 *
 * // With custom initial route
 * renderWithProviders(<MyComponent />, { initialEntries: ['/products/test'] });
 *
 * // Without wishlist context
 * renderWithProviders(<MyComponent />, { withWishlist: false });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {},
) {
  const {initialEntries, withWishlist, withRouter, ...renderOptions} = options;

  return render(ui, {
    wrapper: createWrapper({initialEntries, withWishlist, withRouter}),
    ...renderOptions,
  });
}

// ============================================
// WISHLIST-SPECIFIC WRAPPER
// ============================================

/**
 * Wrapper for testing hooks that need WishlistProvider
 */
export function WishlistWrapper({children}: {children: ReactNode}) {
  return <WishlistProvider>{children}</WishlistProvider>;
}

// ============================================
// ROUTER-ONLY WRAPPER
// ============================================

/**
 * Creates a MemoryRouter wrapper for testing navigation
 */
export function createRouterWrapper(initialEntries: string[] = ['/']) {
  return function RouterWrapper({children}: {children: ReactNode}) {
    return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;
  };
}

// ============================================
// RE-EXPORT TESTING LIBRARY
// ============================================

export * from '@testing-library/react';
export {default as userEvent} from '@testing-library/user-event';

// Override render with our custom version as default
export {renderWithProviders as render};
