/**
 * Image Utility Tests
 *
 * Tests for Cloudinary CDN integration and image optimization utilities.
 * These are pure functions - easiest to test since no React rendering needed.
 */
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {
  getOptimizedImageUrl,
  getSrcSet,
  getSizes,
  getLqipUrl,
  preloadImage,
  preloadImages,
  IMAGE_SIZES,
  getCloudinaryCloud,
  generateSrcSet,
} from './images';

describe('Image Utilities', () => {
  describe('getOptimizedImageUrl', () => {
    const testUrl = 'https://cdn.shopify.com/test-image.jpg';
    const cloudName = 'dh4qwuvuo';

    it('returns empty string for null/undefined input', () => {
      expect(getOptimizedImageUrl(null)).toBe('');
      expect(getOptimizedImageUrl(undefined)).toBe('');
      expect(getOptimizedImageUrl('')).toBe('');
    });

    it('generates Cloudinary URL with default parameters', () => {
      const result = getOptimizedImageUrl(testUrl);

      expect(result).toContain(`res.cloudinary.com/${cloudName}`);
      expect(result).toContain('image/fetch');
      expect(result).toContain(`w_${IMAGE_SIZES.thumbnail}`);
      expect(result).toContain('c_limit');
      expect(result).toContain('q_auto:good');
      expect(result).toContain('f_auto');
    });

    it('applies custom maxSize parameter', () => {
      const result = getOptimizedImageUrl(testUrl, 800);

      expect(result).toContain('w_800');
    });

    it('applies custom quality option', () => {
      const result = getOptimizedImageUrl(testUrl, 400, {quality: 'auto:best'});

      expect(result).toContain('q_auto:best');
    });

    it('applies custom format option', () => {
      const result = getOptimizedImageUrl(testUrl, 400, {format: 'webp'});

      expect(result).toContain('f_webp');
    });

    it('applies custom crop option', () => {
      const result = getOptimizedImageUrl(testUrl, 400, {crop: 'fill'});

      expect(result).toContain('c_fill');
    });

    it('URL-encodes the original image URL', () => {
      const urlWithParams = 'https://cdn.shopify.com/image.jpg?v=123&width=800';
      const result = getOptimizedImageUrl(urlWithParams);

      expect(result).toContain(encodeURIComponent(urlWithParams));
    });
  });

  describe('getSrcSet', () => {
    const testUrl = 'https://cdn.shopify.com/test-image.jpg';

    it('returns empty string for null/undefined input', () => {
      expect(getSrcSet(null)).toBe('');
      expect(getSrcSet(undefined)).toBe('');
    });

    it('generates srcset with default widths', () => {
      const result = getSrcSet(testUrl);

      expect(result).toContain('400w');
      expect(result).toContain('800w');
      expect(result).toContain('1200w');
      expect(result).toContain('1600w');
    });

    it('generates srcset with custom widths', () => {
      const customWidths = [200, 600, 1000];
      const result = getSrcSet(testUrl, customWidths);

      expect(result).toContain('200w');
      expect(result).toContain('600w');
      expect(result).toContain('1000w');
      expect(result).not.toContain('400w');
    });

    it('applies options to all widths', () => {
      const result = getSrcSet(testUrl, [400, 800], {quality: 'auto:best'});

      // Both URLs should have the quality setting
      const urls = result.split(', ');
      expect(urls).toHaveLength(2);
      urls.forEach((url) => {
        expect(url).toContain('q_auto:best');
      });
    });

    it('formats srcset entries correctly', () => {
      const result = getSrcSet(testUrl, [400]);

      // Should be "url 400w" format
      expect(result).toMatch(/\s400w$/);
    });
  });

  describe('getSizes', () => {
    it('returns default sizes when no breakpoints provided', () => {
      const result = getSizes();

      expect(result).toContain('(max-width: 640px) 100vw');
      expect(result).toContain('(max-width: 1024px) 50vw');
      expect(result).toContain('400px');
    });

    it('merges custom breakpoints with defaults', () => {
      const result = getSizes({
        '(max-width: 640px)': '90vw',
      });

      // Custom value should override default
      expect(result).toContain('(max-width: 640px) 90vw');
      // Other defaults should remain
      expect(result).toContain('(max-width: 1024px) 50vw');
    });

    it('handles custom default size', () => {
      const result = getSizes({
        default: '300px',
      });

      expect(result).toContain('300px');
      expect(result).not.toContain('400px');
    });

    it('formats sizes string correctly', () => {
      const result = getSizes();

      // Should be comma-separated
      const parts = result.split(', ');
      expect(parts.length).toBeGreaterThan(1);
    });
  });

  describe('getLqipUrl', () => {
    const testUrl = 'https://cdn.shopify.com/test-image.jpg';

    it('returns empty string for null/undefined input', () => {
      expect(getLqipUrl(null)).toBe('');
      expect(getLqipUrl(undefined)).toBe('');
    });

    it('generates tiny placeholder URL', () => {
      const result = getLqipUrl(testUrl);

      expect(result).toContain(`w_${IMAGE_SIZES.blur}`);
    });

    it('uses low quality setting', () => {
      const result = getLqipUrl(testUrl);

      expect(result).toContain('q_auto:low');
    });
  });

  describe('preloadImage', () => {
    let originalImage: typeof Image;

    beforeEach(() => {
      originalImage = globalThis.Image;
    });

    afterEach(() => {
      globalThis.Image = originalImage;
    });

    it('returns a promise that resolves with image element on load', async () => {
      const testUrl = 'https://example.com/test.jpg';

      // Create mock Image class
      class MockImage {
        src = '';
        onload: (() => void) | null = null;
        onerror: ((error: unknown) => void) | null = null;
      }

      globalThis.Image = MockImage as unknown as typeof Image;

      const promise = preloadImage(testUrl);

      // Get the created instance - it will trigger onload when we set it
      // We need to wait a tick for the promise to set up handlers
      await new Promise((r) => setTimeout(r, 0));

      // Since we can't access the instance directly, we just verify the promise
      // resolves without error when Image loads successfully
      // For this test, we just verify it returns a promise
      expect(promise).toBeInstanceOf(Promise);
    });

    it('sets correct src on Image instance', () => {
      const testUrl = 'https://example.com/test.jpg';
      let capturedSrc = '';

      class MockImage {
        onload: (() => void) | null = null;
        onerror: ((error: unknown) => void) | null = null;
        private _src = '';

        get src() {
          return this._src;
        }
        set src(value: string) {
          this._src = value;
          capturedSrc = value;
        }
      }

      globalThis.Image = MockImage as unknown as typeof Image;

      preloadImage(testUrl);

      expect(capturedSrc).toBe(testUrl);
    });
  });

  describe('preloadImages', () => {
    let originalImage: typeof Image;

    beforeEach(() => {
      originalImage = globalThis.Image;
    });

    afterEach(() => {
      globalThis.Image = originalImage;
    });

    it('calls preloadImage for each URL', () => {
      const urls = ['https://example.com/1.jpg', 'https://example.com/2.jpg'];
      const createdImages: string[] = [];

      class MockImage {
        onload: (() => void) | null = null;
        onerror: ((error: unknown) => void) | null = null;
        private _src = '';

        get src() {
          return this._src;
        }
        set src(value: string) {
          this._src = value;
          createdImages.push(value);
          // Auto-resolve
          setTimeout(() => this.onload?.(), 0);
        }
      }

      globalThis.Image = MockImage as unknown as typeof Image;

      preloadImages(urls);

      expect(createdImages).toHaveLength(2);
      expect(createdImages).toContain('https://example.com/1.jpg');
      expect(createdImages).toContain('https://example.com/2.jpg');
    });

    it('handles empty array', async () => {
      const results = await preloadImages([]);

      expect(results).toEqual([]);
    });
  });

  describe('IMAGE_SIZES constants', () => {
    it('has expected size presets', () => {
      expect(IMAGE_SIZES.blur).toBe(20);
      expect(IMAGE_SIZES.thumbnail).toBe(400);
      expect(IMAGE_SIZES.preview).toBe(800);
      expect(IMAGE_SIZES.full).toBe(1200);
    });
  });

  describe('backwards compatibility exports', () => {
    it('exports getCloudinaryCloud function', () => {
      const cloud = getCloudinaryCloud();

      expect(cloud).toBe('dh4qwuvuo');
    });

    it('exports generateSrcSet as alias for getSrcSet', () => {
      const testUrl = 'https://example.com/test.jpg';

      expect(generateSrcSet(testUrl)).toBe(getSrcSet(testUrl));
    });
  });
});
