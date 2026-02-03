/**
 * Homepage Route Tests
 *
 * Tests for the index route including CMS content rendering,
 * static fallback components, and product display.
 */
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Homepage from './_index';
import {createMockProduct, createMockCollection} from '~/test/mocks';
import type {ReactNode} from 'react';

// Mock route content
const mockRouteContent = {
  sections: {
    references: {
      nodes: [
        {id: 'section-1', type: 'section_hero'},
      ],
    },
  },
};

// Mock loader data
const mockLoaderData = {
  route: null,
  featuredCollection: createMockCollection(),
  recommendedProducts: {
    products: {
      nodes: [
        createMockProduct({title: 'Product 1', handle: 'product-1'}),
        createMockProduct({title: 'Product 2', handle: 'product-2'}),
      ],
    },
  },
};

// Mock Remix hooks
vi.mock('@remix-run/react', () => ({
  useLoaderData: () => mockLoaderData,
  Link: ({children, to, ...props}: {children: ReactNode; to: string; [key: string]: unknown}) => (
    <a href={to} {...props}>{children}</a>
  ),
  Await: ({resolve, children}: {resolve: Promise<unknown> | unknown; children: (data: unknown) => ReactNode}) => {
    // Handle both promise and resolved value
    if (resolve && typeof resolve === 'object' && 'then' in resolve) {
      // For testing, resolve synchronously
      return <>{children(mockLoaderData.recommendedProducts)}</>;
    }
    return <>{children(resolve)}</>;
  },
}));

// Mock sections
vi.mock('~/sections', () => ({
  RouteContent: ({route}: {route: unknown}) => (
    <div data-testid="route-content">CMS Content</div>
  ),
  ROUTE_CONTENT_QUERY: 'mock query',
  hasRouteContent: (route: unknown) => route !== null && typeof route === 'object',
}));

// Mock ProductQuickView
vi.mock('~/components/ProductQuickView', () => ({
  ProductQuickView: ({isOpen, onClose, productHandle}: {
    isOpen: boolean;
    onClose: () => void;
    productHandle: string | null;
  }) => isOpen ? (
    <div data-testid="quick-view" data-handle={productHandle}>
      <button onClick={onClose}>Close</button>
    </div>
  ) : null,
  QuickViewButton: ({productHandle, onQuickView}: {
    productHandle: string;
    onQuickView: (handle: string) => void;
  }) => (
    <button
      data-testid={`quick-view-btn-${productHandle}`}
      onClick={() => onQuickView(productHandle)}
    >
      Quick View
    </button>
  ),
}));

// Mock Wishlist
vi.mock('~/components/Wishlist', () => ({
  WishlistButton: ({product}: {product: unknown}) => (
    <button data-testid="wishlist-btn">Wishlist</button>
  ),
}));

// Mock Hydrogen
vi.mock('@shopify/hydrogen', () => ({
  Money: ({data}: {data: {amount: string}}) => <span>${data.amount}</span>,
}));

// Mock image utils
vi.mock('~/utils/images', () => ({
  getOptimizedImageUrl: (url: string) => url,
  getSrcSet: (url: string) => `${url} 400w`,
  getSizes: () => '100vw',
  IMAGE_SIZES: {thumbnail: 400, preview: 800, full: 1200, blur: 20},
}));

describe('Homepage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to static homepage
    mockLoaderData.route = null;
  });

  describe('CMS content path', () => {
    it('renders RouteContent when CMS data exists', () => {
      mockLoaderData.route = mockRouteContent as any;

      render(<Homepage />);

      expect(screen.getByTestId('route-content')).toBeInTheDocument();
    });

    it('does not render static sections when CMS exists', () => {
      mockLoaderData.route = mockRouteContent as any;

      render(<Homepage />);

      expect(screen.queryByText(/the peak collection/i)).not.toBeInTheDocument();
    });
  });

  describe('static fallback', () => {
    it('renders hero section', () => {
      render(<Homepage />);

      expect(screen.getByText(/the peak/i)).toBeInTheDocument();
      expect(screen.getByText(/collection/i)).toBeInTheDocument();
    });

    it('renders hero image', () => {
      render(<Homepage />);

      const heroSection = document.querySelector('.hero-section');
      const img = heroSection?.querySelector('img');

      expect(img).toBeInTheDocument();
      expect(img?.alt).toContain('Peak');
    });

    it('renders shop now button in hero', () => {
      render(<Homepage />);

      // Multiple "shop now" buttons exist - hero and midweight sections
      const shopButtons = screen.getAllByRole('link', {name: /shop now/i});
      expect(shopButtons.length).toBeGreaterThan(0);
      expect(shopButtons[0]).toHaveAttribute('href', '/collections');
    });

    it('renders new arrivals section', () => {
      render(<Homepage />);

      expect(screen.getByText(/new arrivals/i)).toBeInTheDocument();
      expect(screen.getByText(/spring/i)).toBeInTheDocument();
    });

    it('renders brand values section', () => {
      render(<Homepage />);

      expect(screen.getByText(/liquid combines/i)).toBeInTheDocument();
    });

    it('renders midweight section', () => {
      render(<Homepage />);

      expect(screen.getByText(/midweight classics/i)).toBeInTheDocument();
    });

    it('renders newsletter section', () => {
      render(<Homepage />);

      expect(screen.getByText(/stay in the know/i)).toBeInTheDocument();
    });
  });

  describe('new arrivals products', () => {
    it('renders product cards', () => {
      render(<Homepage />);

      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    it('renders product prices', () => {
      render(<Homepage />);

      const prices = screen.getAllByText(/\$/);
      expect(prices.length).toBeGreaterThan(0);
    });

    it('renders product links', () => {
      render(<Homepage />);

      // Product links - multiple elements with same name (title + image link)
      const productLinks = screen.getAllByRole('link', {name: /product 1/i});
      expect(productLinks.length).toBeGreaterThan(0);
      const productLink = productLinks.find(link => link.getAttribute('href')?.includes('/products/'));
      expect(productLink).toHaveAttribute('href', '/products/product-1');
    });

    it('renders wishlist buttons for products', () => {
      render(<Homepage />);

      const wishlistBtns = screen.getAllByTestId('wishlist-btn');
      expect(wishlistBtns.length).toBeGreaterThan(0);
    });

    it('renders quick view buttons for products', () => {
      render(<Homepage />);

      expect(screen.getByTestId('quick-view-btn-product-1')).toBeInTheDocument();
      expect(screen.getByTestId('quick-view-btn-product-2')).toBeInTheDocument();
    });
  });

  describe('quick view integration', () => {
    it('opens quick view when button is clicked', async () => {
      const user = userEvent.setup();

      render(<Homepage />);

      await user.click(screen.getByTestId('quick-view-btn-product-1'));

      expect(screen.getByTestId('quick-view')).toBeInTheDocument();
      expect(screen.getByTestId('quick-view')).toHaveAttribute('data-handle', 'product-1');
    });

    it('closes quick view when close button is clicked', async () => {
      const user = userEvent.setup();

      render(<Homepage />);

      // Open quick view
      await user.click(screen.getByTestId('quick-view-btn-product-1'));
      expect(screen.getByTestId('quick-view')).toBeInTheDocument();

      // Close quick view
      await user.click(screen.getByRole('button', {name: /close/i}));
      expect(screen.queryByTestId('quick-view')).not.toBeInTheDocument();
    });
  });

  describe('newsletter form', () => {
    it('renders email input', () => {
      render(<Homepage />);

      const emailInput = screen.getByPlaceholderText(/email/i);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('renders subscribe button', () => {
      render(<Homepage />);

      const subscribeBtn = screen.getByRole('button', {name: /subscribe/i});
      expect(subscribeBtn).toBeInTheDocument();
    });

    it('prevents default form submission', async () => {
      const user = userEvent.setup();

      render(<Homepage />);

      const form = document.querySelector('.newsletter-form');
      const submitEvent = new Event('submit', {bubbles: true, cancelable: true});

      form?.dispatchEvent(submitEvent);

      // Form should prevent default
      expect(submitEvent.defaultPrevented).toBe(true);
    });
  });

  describe('social links', () => {
    it('renders social media links', () => {
      render(<Homepage />);

      const twitterLink = screen.getByRole('link', {name: /twitter/i});
      const instagramLink = screen.getByRole('link', {name: /instagram/i});
      const facebookLink = screen.getByRole('link', {name: /facebook/i});

      expect(twitterLink).toBeInTheDocument();
      expect(instagramLink).toBeInTheDocument();
      expect(facebookLink).toBeInTheDocument();
    });

    it('opens social links in new tab', () => {
      render(<Homepage />);

      const socialLinks = screen.getAllByRole('link').filter(
        (link) => link.getAttribute('target') === '_blank',
      );

      expect(socialLinks.length).toBeGreaterThan(0);
      socialLinks.forEach((link) => {
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
      });
    });
  });

  describe('page structure', () => {
    it('wraps content in home class', () => {
      const {container} = render(<Homepage />);

      expect(container.querySelector('.home')).toBeInTheDocument();
    });
  });
});
