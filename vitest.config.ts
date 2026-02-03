/**
 * LEARNING: Vitest Configuration
 *
 * Vitest is the recommended test runner for Vite-based projects like Hydrogen.
 * It's faster than Jest because it reuses Vite's transform pipeline.
 *
 * Key config options explained:
 * - globals: true → No need to import describe/it/expect in every file
 * - environment: 'jsdom' → Simulates browser APIs (window, document, localStorage)
 * - setupFiles → Runs before each test file (add custom matchers, mocks)
 * - include → Which files are tests (*.test.ts, *.test.tsx)
 */
import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Enable global test functions (describe, it, expect) without imports
    globals: true,

    // Use jsdom to simulate browser environment
    // Required for testing React components and browser APIs like localStorage
    environment: 'jsdom',

    // Setup file runs before each test file
    setupFiles: ['./app/test/setup.ts'],

    // Which files to treat as tests
    include: ['app/**/*.test.{ts,tsx}'],

    // Exclude node_modules and build artifacts
    exclude: ['node_modules', 'dist', 'hydrogen-2026-temp'],

    // Coverage configuration (run with --coverage flag)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['app/**/*.{ts,tsx}'],
      exclude: ['app/test/**', 'app/**/*.test.{ts,tsx}'],
    },
  },

  // Resolve path aliases to match tsconfig
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
    },
  },
});
