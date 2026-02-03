/**
 * Image optimization utilities
 * Provides Cloudinary CDN integration with fallback to Shopify CDN
 *
 * CDN Benefits:
 * - Global edge caching (200+ PoPs)
 * - Automatic WebP/AVIF format conversion
 * - Quality optimization
 * - ~70% smaller file sizes
 */

/**
 * Cloudinary cloud name - set at BUILD TIME by Vite
 * This gets baked into the client bundle, so it works in browser
 * On server/edge, this may be empty string (falls back to Shopify CDN)
 */
const CLOUDINARY_CLOUD = (() => {
  try {
    // Vite replaces this at build time for client bundles
    return import.meta.env?.VITE_CLOUDINARY_CLOUD || '';
  } catch {
    return '';
  }
})();

export interface ImageOptions {
  width?: number;
  height?: number;
  /** Quality: number (1-100) or Cloudinary preset ('auto', 'auto:good', 'auto:best') */
  quality?: number | string;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'pad' | 'limit';
  gravity?: 'auto' | 'face' | 'center';
}

/**
 * Image size presets optimized for display sizes
 */
export const IMAGE_SIZES = {
  blur: 20,        // Tiny placeholder for blur-up effect (~1KB)
  thumbnail: 400,  // Product grid cards (~15-30KB)
  preview: 800,    // Product page, hero sections (~40-80KB)
  full: 1200,      // Lightbox / high-res (~100-200KB)
};

/**
 * Get the Cloudinary cloud name
 */
export function getCloudinaryCloud(): string {
  return CLOUDINARY_CLOUD;
}

/**
 * Transform a Shopify CDN URL to use Cloudinary's fetch feature
 * Falls back to Shopify's built-in transforms if Cloudinary is not configured
 *
 * Cloudinary transforms:
 * - f_auto: Automatic format (WebP/AVIF when supported)
 * - q_auto:good: Better compression with minimal quality loss (~30-40% smaller)
 * - c_limit: Don't upscale, only downscale
 */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  options: ImageOptions = {},
): string {
  if (!url) return '';

  const {
    width,
    height,
    quality = 'auto:good', // Use Cloudinary's smart quality
    format = 'auto',
    crop = 'limit', // Don't upscale images
  } = options;

  const cloudinaryCloud = getCloudinaryCloud();

  // If Cloudinary is configured, use fetch delivery
  if (cloudinaryCloud) {
    const transformations: string[] = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push(`c_${crop}`);
    transformations.push(`q_${quality}`);
    transformations.push(`f_${format}`);

    const transform = transformations.join(',');
    return `https://res.cloudinary.com/${cloudinaryCloud}/image/fetch/${transform}/${encodeURIComponent(url)}`;
  }

  // Fallback to Shopify CDN transforms
  return getShopifyOptimizedUrl(url, options);
}

/**
 * Use Shopify's built-in image CDN transforms
 * https://shopify.dev/docs/api/storefront/current/objects/Image
 */
export function getShopifyOptimizedUrl(
  url: string,
  options: ImageOptions = {},
): string {
  if (!url) return '';

  const {width, height} = options;

  // Shopify CDN URLs support width/height transforms via URL params
  // Example: image.jpg?width=800&height=600
  const urlObj = new URL(url);

  if (width) urlObj.searchParams.set('width', String(width));
  if (height) urlObj.searchParams.set('height', String(height));

  return urlObj.toString();
}

/**
 * Generate responsive srcset for an image
 */
export function generateSrcSet(
  url: string | undefined | null,
  widths: number[] = [320, 640, 960, 1280, 1600],
  options: Omit<ImageOptions, 'width'> = {},
): string {
  if (!url) return '';

  return widths
    .map((w) => {
      const optimizedUrl = getOptimizedImageUrl(url, {...options, width: w});
      return `${optimizedUrl} ${w}w`;
    })
    .join(', ');
}

/**
 * Generate a low-quality image placeholder (LQIP) URL
 */
export function getLqipUrl(url: string | undefined | null): string {
  return getOptimizedImageUrl(url, {
    width: 20,
    quality: 30,
    format: 'jpg',
  });
}
