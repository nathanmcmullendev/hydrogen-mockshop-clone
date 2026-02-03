import {useState} from 'react';
import {
  getOptimizedImageUrl,
  getSrcSet,
  getLqipUrl,
  IMAGE_SIZES,
} from '~/utils/images';

interface OptimizedImageProps {
  /** Direct image URL */
  src: string;
  /** Alt text for the image */
  alt: string;
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
  /** Max image size (uses IMAGE_SIZES presets) */
  maxSize?: number;
  /** Whether to show blur placeholder while loading */
  showPlaceholder?: boolean;
  /** Priority loading for above-fold images */
  priority?: boolean;
}

/**
 * OptimizedImage component that uses Cloudinary CDN for image optimization.
 *
 * Features:
 * - Automatic WebP/AVIF conversion via Cloudinary
 * - Responsive srcset generation
 * - Optional blur placeholder (LQIP)
 * - Priority loading support
 * - Image reveal animation
 */
export function OptimizedImage({
  src,
  alt,
  aspectRatio = '1/1',
  width = 400,
  height = 400,
  loading = 'lazy',
  sizes = '100vw',
  className = '',
  maxSize = IMAGE_SIZES.thumbnail,
  showPlaceholder = false,
  priority = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src) {
    return <div className="product-image-placeholder" />;
  }

  // Generate Cloudinary optimized URLs
  const optimizedSrc = getOptimizedImageUrl(src, maxSize);
  const srcSet = getSrcSet(src, [200, 400, 600, 800, 1200]);
  const placeholderUrl = showPlaceholder ? getLqipUrl(src) : undefined;

  // Determine loading behavior
  const imgLoading = priority ? 'eager' : loading;
  const fetchPriority = priority ? 'high' : 'auto';

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
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={imgLoading}
        fetchPriority={fetchPriority}
        onLoad={() => setIsLoaded(true)}
        className={`product-image ${isLoaded ? 'loaded' : ''}`}
        style={{aspectRatio, objectFit: 'cover'}}
      />
    </div>
  );
}
