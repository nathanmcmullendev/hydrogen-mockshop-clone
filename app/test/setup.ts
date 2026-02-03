/**
 * LEARNING: Test Setup File
 *
 * This file runs before each test file. Use it to:
 * 1. Extend expect with custom matchers (toBeInTheDocument, etc.)
 * 2. Set up global mocks (localStorage, fetch, etc.)
 * 3. Configure test environment
 *
 * Why @testing-library/jest-dom?
 * - Adds DOM-specific matchers like toBeInTheDocument(), toHaveTextContent()
 * - Makes assertions more readable and gives better error messages
 * - Works with Vitest despite the "jest" in the name
 */
import '@testing-library/jest-dom/vitest';
import {afterEach, vi} from 'vitest';
import {cleanup} from '@testing-library/react';

/**
 * LEARNING: Automatic Cleanup
 *
 * After each test, unmount React components to prevent test pollution.
 * Without this, components from previous tests could affect later ones.
 */
afterEach(() => {
  cleanup();
});

/**
 * LEARNING: Mock localStorage
 *
 * jsdom provides localStorage, but it persists between tests.
 * We clear it after each test to ensure isolation.
 *
 * For more complex scenarios, you might mock localStorage entirely:
 * const localStorageMock = { getItem: vi.fn(), setItem: vi.fn(), ... }
 */
afterEach(() => {
  localStorage.clear();
});

/**
 * LEARNING: Mock window.matchMedia
 *
 * Some components use CSS media queries via matchMedia.
 * jsdom doesn't implement it, so we provide a mock.
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

/**
 * LEARNING: Suppress React 18 console errors in tests
 *
 * React 18's concurrent features can cause act() warnings in tests.
 * This is often a false positive. We suppress the noise but you should
 * still fix genuine issues.
 */
const originalError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
      args[0].includes('Warning: An update to') ||
      args[0].includes('act(...)'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};

/**
 * Mock window.scrollTo
 * jsdom doesn't implement scrollTo, needed for some navigation tests.
 */
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

/**
 * Mock IntersectionObserver
 * Used by lazy loading and infinite scroll components.
 */
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

/**
 * Mock ResizeObserver
 * Used by responsive components.
 */
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});
