/**
 * LEARNING: Testing Collection Sort Utilities
 *
 * This file demonstrates the same testing patterns as search.test.ts
 * but for collection-specific sort options.
 *
 * Key learning: When you have similar utilities across files,
 * you can either:
 * 1. Duplicate tests (current approach - explicit, easy to understand)
 * 2. Extract to shared utility + shared tests (DRY, but adds abstraction)
 *
 * For a learning resource, explicit duplication is often better
 * because each file is self-contained and easier to follow.
 */
import {describe, it, expect} from 'vitest';
import {
  getSortParam,
  parseSortParam,
  COLLECTION_SORT_OPTIONS,
} from './collections.$handle';

describe('Collection Sort Utilities', () => {
  describe('getSortParam', () => {
    it('returns key only when direction is null', () => {
      expect(getSortParam('COLLECTION_DEFAULT', null)).toBe('COLLECTION_DEFAULT');
      expect(getSortParam('BEST_SELLING', null)).toBe('BEST_SELLING');
    });

    it('combines key and direction for price ascending', () => {
      expect(getSortParam('PRICE', 'ASC')).toBe('PRICE_ASC');
    });

    it('combines key and direction for price descending', () => {
      expect(getSortParam('PRICE', 'DESC')).toBe('PRICE_DESC');
    });

    it('handles title sorts', () => {
      expect(getSortParam('TITLE', 'ASC')).toBe('TITLE_ASC');
      expect(getSortParam('TITLE', 'DESC')).toBe('TITLE_DESC');
    });
  });

  describe('parseSortParam', () => {
    it('parses COLLECTION_DEFAULT as not reversed', () => {
      const result = parseSortParam('COLLECTION_DEFAULT');
      expect(result).toEqual({key: 'COLLECTION_DEFAULT', reverse: false});
    });

    it('parses BEST_SELLING as not reversed', () => {
      const result = parseSortParam('BEST_SELLING');
      expect(result).toEqual({key: 'BEST_SELLING', reverse: false});
    });

    it('parses PRICE_ASC as not reversed', () => {
      const result = parseSortParam('PRICE_ASC');
      expect(result).toEqual({key: 'PRICE', reverse: false});
    });

    it('parses PRICE_DESC as reversed', () => {
      const result = parseSortParam('PRICE_DESC');
      expect(result).toEqual({key: 'PRICE', reverse: true});
    });

    it('parses TITLE_ASC as not reversed', () => {
      const result = parseSortParam('TITLE_ASC');
      expect(result).toEqual({key: 'TITLE', reverse: false});
    });

    it('parses TITLE_DESC as reversed', () => {
      const result = parseSortParam('TITLE_DESC');
      expect(result).toEqual({key: 'TITLE', reverse: true});
    });

    it('parses CREATED_DESC as reversed (newest first)', () => {
      const result = parseSortParam('CREATED_DESC');
      expect(result).toEqual({key: 'CREATED', reverse: true});
    });
  });

  describe('COLLECTION_SORT_OPTIONS roundtrip', () => {
    /**
     * LEARNING: Property-based testing lite
     *
     * This test verifies that ALL options can be encoded and decoded.
     * It's like property-based testing but simpler - we test every
     * member of a known set rather than generating random inputs.
     */
    it('all options roundtrip correctly', () => {
      COLLECTION_SORT_OPTIONS.forEach((option) => {
        const encoded = getSortParam(option.key, option.direction);
        const decoded = parseSortParam(encoded);

        expect(decoded.key).toBe(option.key);

        if (option.direction === 'DESC') {
          expect(decoded.reverse).toBe(true);
        } else {
          expect(decoded.reverse).toBe(false);
        }
      });
    });
  });

  describe('COLLECTION_SORT_OPTIONS', () => {
    it('has 7 sort options', () => {
      expect(COLLECTION_SORT_OPTIONS).toHaveLength(7);
    });

    it('has expected labels', () => {
      const labels = COLLECTION_SORT_OPTIONS.map((o) => o.label);
      expect(labels).toContain('Featured');
      expect(labels).toContain('Best Selling');
      expect(labels).toContain('Newest');
      expect(labels).toContain('Price: Low to High');
      expect(labels).toContain('Price: High to Low');
      expect(labels).toContain('Alphabetically: A-Z');
      expect(labels).toContain('Alphabetically: Z-A');
    });

    it('Featured is the first (default) option', () => {
      expect(COLLECTION_SORT_OPTIONS[0].label).toBe('Featured');
      expect(COLLECTION_SORT_OPTIONS[0].key).toBe('COLLECTION_DEFAULT');
    });
  });
});
