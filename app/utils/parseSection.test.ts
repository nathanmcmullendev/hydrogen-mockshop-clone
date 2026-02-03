/**
 * parseSection Utility Tests
 *
 * Tests for the metaobject parsing utilities that transform
 * GraphQL responses into usable component data.
 */
import {describe, it, expect, vi} from 'vitest';
import {parseSection} from './parseSection';

// Mock @shopify/hydrogen's parseMetafield
vi.mock('@shopify/hydrogen', () => ({
  parseMetafield: vi.fn((field: {type: string; value: string}) => ({
    ...field,
    parsedValue: field.value,
  })),
}));

describe('parseSection', () => {
  describe('basic parsing', () => {
    it('returns empty object for empty input', () => {
      const result = parseSection({});

      expect(result).toEqual({});
    });

    it('preserves primitive values', () => {
      const input = {
        id: 'test-id',
        type: 'section_hero',
        handle: 'test-handle',
      };

      const result = parseSection(input);

      expect(result.id).toBe('test-id');
      expect(result.type).toBe('section_hero');
      expect(result.handle).toBe('test-handle');
    });

    it('handles null values', () => {
      const input = {
        id: 'test-id',
        nullField: null,
      };

      const result = parseSection(input);

      expect(result.id).toBe('test-id');
      // Null values are treated as falsy and not included in output
      // The parseSection function skips non-object values that don't have type/value
    });
  });

  describe('metafield parsing', () => {
    it('parses single_line_text_field metafields', () => {
      const input = {
        heading: {
          type: 'single_line_text_field',
          value: 'Welcome to our store',
        },
      };

      const result = parseSection(input);

      expect(result.heading).toBeDefined();
      expect(result.heading.parsedValue).toBe('Welcome to our store');
    });

    it('parses multi_line_text_field metafields', () => {
      const input = {
        description: {
          type: 'multi_line_text_field',
          value: 'Line 1\nLine 2\nLine 3',
        },
      };

      const result = parseSection(input);

      expect(result.description).toBeDefined();
      expect(result.description.parsedValue).toContain('Line 1');
    });

    it('parses boolean metafields', () => {
      const input = {
        isEnabled: {
          type: 'boolean',
          value: 'true',
        },
        isDisabled: {
          type: 'boolean',
          value: 'false',
        },
      };

      const result = parseSection(input);

      expect(result.isEnabled.parsedValue).toBe(true);
      expect(result.isDisabled.parsedValue).toBe(false);
    });

    it('parses number_integer metafields', () => {
      const input = {
        count: {
          type: 'number_integer',
          value: '42',
        },
      };

      const result = parseSection(input);

      expect(result.count.parsedValue).toBe(42);
    });

    it('parses number_decimal metafields', () => {
      const input = {
        price: {
          type: 'number_decimal',
          value: '29.99',
        },
      };

      const result = parseSection(input);

      expect(result.price.parsedValue).toBe(29.99);
    });

    it('returns raw node for unknown metafield types', () => {
      const input = {
        customField: {
          type: 'custom_type',
          value: 'custom value',
        },
      };

      const result = parseSection(input);

      expect(result.customField).toEqual({
        type: 'custom_type',
        value: 'custom value',
      });
    });
  });

  describe('reference lifting', () => {
    it('lifts reference key from nested objects', () => {
      const input = {
        image: {
          reference: {
            url: 'https://example.com/image.jpg',
            altText: 'Test image',
          },
        },
      };

      const result = parseSection(input);

      // Reference should be lifted
      expect(result.image?.url).toBe('https://example.com/image.jpg');
      expect(result.image?.altText).toBe('Test image');
    });

    it('lifts references key from arrays', () => {
      const input = {
        products: {
          references: {
            nodes: [
              {id: 'product-1', title: 'Product 1'},
              {id: 'product-2', title: 'Product 2'},
            ],
          },
        },
      };

      const result = parseSection(input);

      // References should be lifted
      expect(result.products?.nodes).toHaveLength(2);
      expect(result.products?.nodes[0].id).toBe('product-1');
    });
  });

  describe('recursive parsing', () => {
    it('parses nested objects recursively', () => {
      const input = {
        hero: {
          heading: {
            type: 'single_line_text_field',
            value: 'Hero Title',
          },
          subheading: {
            type: 'single_line_text_field',
            value: 'Hero Subtitle',
          },
        },
      };

      const result = parseSection(input);

      expect(result.hero?.heading?.parsedValue).toBe('Hero Title');
      expect(result.hero?.subheading?.parsedValue).toBe('Hero Subtitle');
    });

    it('parses arrays of sections', () => {
      const input = {
        slides: [
          {
            heading: {
              type: 'single_line_text_field',
              value: 'Slide 1',
            },
          },
          {
            heading: {
              type: 'single_line_text_field',
              value: 'Slide 2',
            },
          },
        ],
      };

      const result = parseSection(input);

      expect(result.slides).toHaveLength(2);
      expect(result.slides[0].heading?.parsedValue).toBe('Slide 1');
      expect(result.slides[1].heading?.parsedValue).toBe('Slide 2');
    });

    it('handles deeply nested structures', () => {
      const input = {
        level1: {
          level2: {
            level3: {
              field: {
                type: 'single_line_text_field',
                value: 'Deep value',
              },
            },
          },
        },
      };

      const result = parseSection(input);

      expect(result.level1?.level2?.level3?.field?.parsedValue).toBe('Deep value');
    });
  });

  describe('edge cases', () => {
    it('handles empty objects in nested structures', () => {
      const input = {
        emptyNested: {},
        validField: {
          type: 'single_line_text_field',
          value: 'Valid',
        },
      };

      const result = parseSection(input);

      // Empty objects should be removed
      expect(result.emptyNested).toBeUndefined();
      expect(result.validField?.parsedValue).toBe('Valid');
    });

    it('handles arrays with mixed content', () => {
      const input = {
        items: [
          {
            heading: {
              type: 'single_line_text_field',
              value: 'Item 1',
            },
          },
          {
            reference: {
              id: 'ref-1',
              title: 'Referenced Item',
            },
          },
        ],
      };

      const result = parseSection(input);

      expect(result.items).toHaveLength(2);
      expect(result.items[0].heading?.parsedValue).toBe('Item 1');
      expect(result.items[1].id).toBe('ref-1');
    });

    it('preserves non-metafield objects', () => {
      const input = {
        priceRange: {
          minVariantPrice: {
            amount: '29.99',
            currencyCode: 'USD',
          },
        },
      };

      const result = parseSection(input);

      // Objects without type/value should be parsed recursively
      // but their structure preserved
      expect(result.priceRange?.minVariantPrice?.amount).toBe('29.99');
    });
  });
});
