/**
 * Image optimization utilities
 * Provides Cloudinary CDN integration for lightning-fast image delivery
 *
 * Based on ecommerce-react-shopify implementation pattern.
 *
 * CDN Benefits:
 * - Global edge caching (200+ PoPs)
 * - Automatic WebP/AVIF format conversion
 * - Quality optimization
 * - ~70% smaller file sizes
 */

/**
 * Cloudinary cloud name
 *
 * NOTE: Hardcoded because import.meta.env doesn't work reliably in Hydrogen's
 * edge runtime. This matches the VITE_CLOUDINARY_CLOUD value in Vercel.
 */
const CLOUDINARY_CLOUD = 'dh4qwuvuo';

/**
 * Image size presets (in pixels)
 * Optimized based on actual display sizes to minimize bandwidth
 */
export const IMAGE_SIZES = {
  blur: 20,        // Tiny placeholder for blur-up effect (~1KB)
  thumbnail: 400,  // Product grid cards (~15-30KB)
  preview: 800,    // Product page, hero sections (~40-80KB)
  full: 1200,      // Lightbox / high-res (~100-200KB)
};

export interface ImageOptions {
  quality?: string;
  format?: string;
  crop?: string;
}

/**
 * Generate optimized image URL via Cloudinary fetch
 *
 * Transforms applied:
 * - w_{size}: Width constraint
 * - c_limit: Don't upscale, only downscale
 * - q_auto:good: Automatic quality (~30-40% smaller than q_auto)
 * - f_auto: Automatic format (WebP/AVIF when supported)
 *
 * @param url - Original image URL (Shopify CDN)
 * @param maxSize - Maximum dimension in pixels
 * @param options - Additional Cloudinary options
 */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  maxSize: number = IMAGE_SIZES.thumbnail,
  options: ImageOptions = {},
): string {
  if (!url) return '';

  const {
    quality = 'auto:good',
    format = 'auto',
    crop = 'limit',
  } = options;

  // Build Cloudinary transform chain
  const transforms = [
    `w_${maxSize}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
  ].join(',');

  // Cloudinary fetch URL format
  const encodedUrl = encodeURIComponent(url);
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/fetch/${transforms}/${encodedUrl}`;
}

/**
 * Generate srcset for responsive images
 * Returns multiple sizes for browser to choose from
 *
 * @param url - Original image URL
 * @param widths - Array of widths to generate
 * @param options - Cloudinary options
 */
export function getSrcSet(
  url: string | undefined | null,
  widths: number[] = [400, 800, 1200, 1600],
  options: ImageOptions = {},
): string {
  if (!url) return '';

  return widths
    .map((w) => `${getOptimizedImageUrl(url, w, options)} ${w}w`)
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 * Tells browser which size to use at each breakpoint
 *
 * @param breakpoints - Object mapping breakpoints to sizes
 */
export function getSizes(breakpoints: Record<string, string> = {}): string {
  const defaults: Record<string, string> = {
    '(max-width: 640px)': '100vw',
    '(max-width: 1024px)': '50vw',
    'default': '400px',
  };

  const merged = {...defaults, ...breakpoints};

  return Object.entries(merged)
    .map(([breakpoint, size]) =>
      breakpoint === 'default' ? size : `${breakpoint} ${size}`,
    )
    .join(', ');
}

/**
 * Get Low Quality Image Placeholder (LQIP)
 * Returns tiny blurred version for instant display
 */
export function getLqipUrl(url: string | undefined | null): string {
  return getOptimizedImageUrl(url, IMAGE_SIZES.blur, {quality: 'auto:low'});
}

/**
 * Preload an image in the background
 */
export function preloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Preload multiple images
 */
export function preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(urls.map(preloadImage));
}

// Re-export for backwards compatibility
export const getCloudinaryCloud = () => CLOUDINARY_CLOUD;
export const generateSrcSet = getSrcSet;
