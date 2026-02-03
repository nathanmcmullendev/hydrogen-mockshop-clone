/**
 * LEARNING: Testing Pure Functions
 *
 * Pure functions are the easiest to test because:
 * 1. Same input always produces same output
 * 2. No side effects (no DOM, no network, no state)
 * 3. No mocking required
 *
 * These sort utility functions are perfect candidates.
 * Test them thoroughly because they're used in URL parsing
 * and incorrect behavior would break user bookmarks/sharing.
 */
import {describe, it, expect} from 'vitest';
import {getSortParam, parseSortParam, SORT_OPTIONS} from './search';

describe('Sort Utilities', () => {
  /**
   * LEARNING: describe() groups related tests
   *
   * Use nested describe blocks to organize:
   * - By function name
   * - By behavior category (happy path, edge cases, errors)
   */
  describe('getSortParam', () => {
    it('returns key only when direction is null', () => {
      // RELEVANCE has no direction
      expect(getSortParam('RELEVANCE', null)).toBe('RELEVANCE');
    });

    it('combines key and ASC direction', () => {
      expect(getSortParam('PRICE', 'ASC')).toBe('PRICE_ASC');
    });

    it('combines key and DESC direction', () => {
      expect(getSortParam('PRICE', 'DESC')).toBe('PRICE_DESC');
    });

    /**
     * LEARNING: Edge case testing
     *
     * What happens with unexpected input?
     * Even if your code doesn't intentionally handle these,
     * documenting behavior prevents surprises.
     */
    it('handles empty string key', () => {
      expect(getSortParam('', 'ASC')).toBe('_ASC');
    });

    it('handles empty string direction', () => {
      // Empty string is FALSY in JavaScript, so ternary returns just key
      // This is correct behavior - empty direction = no direction suffix
      expect(getSortParam('PRICE', '')).toBe('PRICE');
    });
  });

  describe('parseSortParam', () => {
    it('parses RELEVANCE (no direction) as not reversed', () => {
      const result = parseSortParam('RELEVANCE');
      expect(result).toEqual({key: 'RELEVANCE', reverse: false});
    });

    it('parses _ASC suffix as reverse: false', () => {
      const result = parseSortParam('PRICE_ASC');
      expect(result).toEqual({key: 'PRICE', reverse: false});
    });

    it('parses _DESC suffix as reverse: true', () => {
      const result = parseSortParam('PRICE_DESC');
      expect(result).toEqual({key: 'PRICE', reverse: true});
    });

    /**
     * LEARNING: toEqual vs toBe
     *
     * - toBe: strict equality (===), use for primitives
     * - toEqual: deep equality, use for objects/arrays
     *
     * {a: 1} === {a: 1} is FALSE (different references)
     * toEqual({a: 1}, {a: 1}) is TRUE (same structure)
     */

    it('handles unknown sort keys gracefully', () => {
      // Unknown keys should still work (future-proofing)
      const result = parseSortParam('UNKNOWN_KEY');
      expect(result).toEqual({key: 'UNKNOWN_KEY', reverse: false});
    });

    it('handles multiple underscores correctly', () => {
      // Edge case: what if key itself contains underscore?
      const result = parseSortParam('SOME_THING_DESC');
      // Current implementation: replaces only '_DESC' suffix
      expect(result).toEqual({key: 'SOME_THING', reverse: true});
    });
  });

  /**
   * LEARNING: Integration-style tests for related code
   *
   * These tests verify that getSortParam and parseSortParam
   * are inverses of each other - what you encode, you can decode.
   */
  describe('getSortParam and parseSortParam roundtrip', () => {
    it('roundtrips all SORT_OPTIONS correctly', () => {
      SORT_OPTIONS.forEach((option) => {
        const encoded = getSortParam(option.key, option.direction);
        const decoded = parseSortParam(encoded);

        expect(decoded.key).toBe(option.key);

        // Check reverse matches expected direction
        if (option.direction === 'DESC') {
          expect(decoded.reverse).toBe(true);
        } else {
          expect(decoded.reverse).toBe(false);
        }
      });
    });
  });

  /**
   * LEARNING: Snapshot-style test for SORT_OPTIONS
   *
   * This catches accidental changes to the sort options.
   * If someone modifies SORT_OPTIONS, this test fails,
   * forcing them to verify the change is intentional.
   */
  describe('SORT_OPTIONS', () => {
    it('has expected options', () => {
      expect(SORT_OPTIONS).toHaveLength(3);
      expect(SORT_OPTIONS.map((o) => o.label)).toEqual([
        'Relevance',
        'Price: Low to High',
        'Price: High to Low',
      ]);
    });
  });
});
