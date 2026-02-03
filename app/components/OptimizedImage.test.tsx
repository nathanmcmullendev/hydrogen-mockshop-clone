/**
 * OptimizedImage Component Tests
 *
 * Tests for the Cloudinary-optimized image component including
 * srcset generation, placeholder handling, and priority loading.
 */
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {OptimizedImage} from './OptimizedImage';
import {IMAGE_SIZES} from '~/utils/images';

describe('OptimizedImage', () => {
  const testSrc = 'https://cdn.shopify.com/test-image.jpg';
  const testAlt = 'Test product image';

  describe('basic rendering', () => {
    it('renders an image element', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} />);

      expect(screen.getByRole('img', {name: testAlt})).toBeInTheDocument();
    });

    it('renders placeholder div when src is empty', () => {
      const {container} = render(<OptimizedImage src="" alt={testAlt} />);

      expect(container.querySelector('.product-image-placeholder')).toBeInTheDocument();
    });

    it('applies alt text correctly', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} />);

      expect(screen.getByAltText(testAlt)).toBeInTheDocument();
    });

    it('wraps image in container div', () => {
      const {container} = render(<OptimizedImage src={testSrc} alt={testAlt} />);

      expect(container.querySelector('.optimized-image-wrapper')).toBeInTheDocument();
    });

    it('applies custom className to wrapper', () => {
      const {container} = render(
        <OptimizedImage src={testSrc} alt={testAlt} className="custom-class" />,
      );

      const wrapper = container.querySelector('.optimized-image-wrapper');
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('Cloudinary optimization', () => {
    it('generates Cloudinary URL for src', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} />);

      const img = screen.getByRole('img');
      expect(img.getAttribute('src')).toContain('res.cloudinary.com');
    });

    it('generates srcset with multiple widths', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} />);

      const img = screen.getByRole('img');
      const srcset = img.getAttribute('srcset');

      expect(srcset).toContain('200w');
      expect(srcset).toContain('400w');
      expect(srcset).toContain('600w');
      expect(srcset).toContain('800w');
      expect(srcset).toContain('1200w');
    });

    it('applies sizes attribute', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} sizes="50vw" />);

      const img = screen.getByRole('img');
      expect(img.getAttribute('sizes')).toBe('50vw');
    });

    it('uses default sizes when not specified', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} />);

      const img = screen.getByRole('img');
      expect(img.getAttribute('sizes')).toBe('100vw');
    });

    it('respects maxSize prop', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} maxSize={800} />);

      const img = screen.getByRole('img');
      expect(img.getAttribute('src')).toContain('w_800');
    });

    it('uses thumbnail size by default', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} />);

      const img = screen.getByRole('img');
      expect(img.getAttribute('src')).toContain(`w_${IMAGE_SIZES.thumbnail}`);
    });
  });

  describe('dimensions', () => {
    it('applies width and height attributes', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} width={500} height={500} />);

      const img = screen.getByRole('img');
      expect(img.getAttribute('width')).toBe('500');
      expect(img.getAttribute('height')).toBe('500');
    });

    it('uses default 400x400 dimensions', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} />);

      const img = screen.getByRole('img');
      expect(img.getAttribute('width')).toBe('400');
      expect(img.getAttribute('height')).toBe('400');
    });

    it('applies aspect ratio style', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} aspectRatio="16/9" />);

      const img = screen.getByRole('img');
      expect(img.style.aspectRatio).toBe('16/9');
    });

    it('uses default 1/1 aspect ratio', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} />);

      const img = screen.getByRole('img');
      expect(img.style.aspectRatio).toBe('1/1');
    });
  });

  describe('loading behavior', () => {
    it('uses lazy loading by default', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} />);

      const img = screen.getByRole('img');
      expect(img.getAttribute('loading')).toBe('lazy');
    });

    it('uses eager loading when priority is true', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} priority />);

      const img = screen.getByRole('img');
      expect(img.getAttribute('loading')).toBe('eager');
    });

    it('sets high fetchPriority when priority is true', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} priority />);

      const img = screen.getByRole('img');
      expect(img.getAttribute('fetchpriority')).toBe('high');
    });

    it('sets auto fetchPriority by default', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} />);

      const img = screen.getByRole('img');
      expect(img.getAttribute('fetchpriority')).toBe('auto');
    });

    it('respects loading prop over priority', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} loading="eager" />);

      const img = screen.getByRole('img');
      expect(img.getAttribute('loading')).toBe('eager');
    });
  });

  describe('placeholder behavior', () => {
    it('does not show placeholder by default', () => {
      const {container} = render(<OptimizedImage src={testSrc} alt={testAlt} />);

      expect(container.querySelector('.optimized-image-placeholder')).not.toBeInTheDocument();
    });

    it('shows placeholder when showPlaceholder is true', () => {
      const {container} = render(
        <OptimizedImage src={testSrc} alt={testAlt} showPlaceholder />,
      );

      expect(container.querySelector('.optimized-image-placeholder')).toBeInTheDocument();
    });

    it('placeholder has aria-hidden attribute', () => {
      const {container} = render(
        <OptimizedImage src={testSrc} alt={testAlt} showPlaceholder />,
      );

      const placeholder = container.querySelector('.optimized-image-placeholder');
      expect(placeholder).toHaveAttribute('aria-hidden', 'true');
    });

    it('placeholder uses LQIP URL', () => {
      const {container} = render(
        <OptimizedImage src={testSrc} alt={testAlt} showPlaceholder />,
      );

      const placeholder = container.querySelector('.optimized-image-placeholder') as HTMLImageElement;
      expect(placeholder?.src).toContain(`w_${IMAGE_SIZES.blur}`);
    });

    it('hides placeholder after main image loads', async () => {
      const {container} = render(
        <OptimizedImage src={testSrc} alt={testAlt} showPlaceholder />,
      );

      const mainImg = screen.getByRole('img', {name: testAlt});

      // Placeholder should be visible initially
      expect(container.querySelector('.optimized-image-placeholder')).toBeInTheDocument();

      // Simulate image load
      fireEvent.load(mainImg);

      // Placeholder should be hidden after load
      await waitFor(() => {
        expect(container.querySelector('.optimized-image-placeholder')).not.toBeInTheDocument();
      });
    });
  });

  describe('loaded state', () => {
    it('adds loaded class after image loads', async () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} />);

      const img = screen.getByRole('img');

      // Initially no loaded class
      expect(img).not.toHaveClass('loaded');

      // Simulate load
      fireEvent.load(img);

      await waitFor(() => {
        expect(img).toHaveClass('loaded');
      });
    });

    it('applies product-image class', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} />);

      const img = screen.getByRole('img');
      expect(img).toHaveClass('product-image');
    });
  });

  describe('styles', () => {
    it('applies object-fit: cover style', () => {
      render(<OptimizedImage src={testSrc} alt={testAlt} />);

      const img = screen.getByRole('img');
      expect(img.style.objectFit).toBe('cover');
    });

    it('wrapper has relative positioning', () => {
      const {container} = render(<OptimizedImage src={testSrc} alt={testAlt} />);

      const wrapper = container.querySelector('.optimized-image-wrapper');
      expect(wrapper).toHaveStyle({position: 'relative'});
    });
  });
});
