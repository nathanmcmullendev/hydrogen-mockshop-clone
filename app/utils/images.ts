/**
 * Image optimization utilities
 * Provides Cloudinary CDN integration with fallback to Shopify CDN
 */

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'pad';
  gravity?: 'auto' | 'face' | 'center';
}

/**
 * Get the Cloudinary cloud name from environment
 * Returns undefined if not configured (will fall back to Shopify CDN)
 */
export function getCloudinaryCloud(): string | undefined {
  if (typeof window !== 'undefined') {
    return (window as any).ENV?.VITE_CLOUDINARY_CLOUD;
  }
  return undefined;
}

/**
 * Transform a Shopify CDN URL to use Cloudinary's fetch feature
 * Falls back to Shopify's built-in transforms if Cloudinary is not configured
 */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  options: ImageOptions = {},
): string {
  if (!url) return '';

  const {
    width,
    height,
    quality = 80,
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
  } = options;

  const cloudinaryCloud = getCloudinaryCloud();

  // If Cloudinary is configured, use fetch delivery
  if (cloudinaryCloud) {
    const transformations: string[] = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push(`q_${quality}`);
    transformations.push(`f_${format}`);
    if (width || height) {
      transformations.push(`c_${crop}`);
      transformations.push(`g_${gravity}`);
    }

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
