import {Image} from '@shopify/hydrogen';
import type {Image as ImageType} from '@shopify/hydrogen/storefront-api-types';
import {useState} from 'react';
import {
  getOptimizedImageUrl,
  generateSrcSet,
  getLqipUrl,
  getCloudinaryCloud,
  type ImageOptions,
} from '~/utils/images';

interface OptimizedImageProps {
  /** Shopify image data object */
  data?: Pick<ImageType, 'url' | 'altText' | 'width' | 'height'> | null;
  /** Direct image URL (alternative to data) */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** CSS aspect ratio (e.g., "1/1", "16/9") */
  aspectRatio?: string;
  /** Display width */
  width?: number;
  /** Display height */
  height?: number;
  /** Loading strategy */
  loading?: 'lazy' | 'eager';
  /** Image sizes attribute for responsive images */
  sizes?: string;
  /** Additional CSS classes */
  className?: string;
  /** Image optimization options */
  imageOptions?: ImageOptions;
  /** Whether to show blur placeholder while loading */
  showPlaceholder?: boolean;
}

/**
 * OptimizedImage component that uses Cloudinary CDN when available,
 * falling back to Shopify's built-in image CDN.
 *
 * Features:
 * - Automatic WebP/AVIF conversion
 * - Responsive srcset generation
 * - Optional blur placeholder (LQIP)
 * - Graceful fallback to Shopify CDN
 */
export function OptimizedImage({
  data,
  src,
  alt,
  aspectRatio,
  width,
  height,
  loading = 'lazy',
  sizes = '100vw',
  className = '',
  imageOptions = {},
  showPlaceholder = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const imageUrl = src || data?.url;
  const imageAlt = alt || data?.altText || '';

  if (!imageUrl) {
    return null;
  }

  // Check if Cloudinary is configured
  const cloudinaryCloud = getCloudinaryCloud();

  // Generate optimized URLs (uses Cloudinary if configured)
  const optimizedSrc = getOptimizedImageUrl(imageUrl, {
    width,
    height,
    ...imageOptions,
  });
  const srcSet = generateSrcSet(imageUrl, undefined, imageOptions);
  const placeholderUrl = showPlaceholder ? getLqipUrl(imageUrl) : undefined;

  // If Cloudinary is NOT configured and we have Shopify image data,
  // use Hydrogen's Image component for its built-in Shopify CDN optimization
  if (!cloudinaryCloud && data) {
    return (
      <div className={`optimized-image-wrapper ${className}`} style={{position: 'relative'}}>
        {showPlaceholder && !isLoaded && placeholderUrl && (
          <img
            src={placeholderUrl}
            alt=""
            aria-hidden="true"
            className="optimized-image-placeholder"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(10px)',
              transform: 'scale(1.1)',
            }}
          />
        )}
        <Image
          data={data}
          aspectRatio={aspectRatio}
          width={width}
          height={height}
          loading={loading}
          sizes={sizes}
          className={className}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    );
  }

  // When Cloudinary IS configured (or no data object), use native img
  // with our Cloudinary-optimized URLs
  return (
    <div className={`optimized-image-wrapper ${className}`} style={{position: 'relative'}}>
      {showPlaceholder && !isLoaded && placeholderUrl && (
        <img
          src={placeholderUrl}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
          }}
        />
      )}
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={imageAlt}
        width={width}
        height={height}
        loading={loading}
        className={className}
        onLoad={() => setIsLoaded(true)}
        style={aspectRatio ? {aspectRatio} : undefined}
      />
    </div>
  );
}
