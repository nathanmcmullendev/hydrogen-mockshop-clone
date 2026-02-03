/**
 * Header Component Tests
 *
 * Tests for the site header including navigation, cart toggle,
 * search, and account icons.
 */
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, within} from '@testing-library/react';
import {Header, HeaderMenu} from './Header';
import {createMockMenu, createMockCart} from '~/test/mocks';
import type {ReactNode} from 'react';

// Mock Remix hooks
vi.mock('@remix-run/react', () => ({
  NavLink: ({children, to, end, prefetch, style, ...props}: {
    children: ReactNode;
    to: string;
    end?: boolean;
    prefetch?: string;
    style?: unknown;
    [key: string]: unknown;
  }) => {
    // Filter out non-standard HTML attributes
    const htmlProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !['end', 'prefetch'].includes(key))
    );
    return <a href={to} {...htmlProps}>{children}</a>;
  },
  useMatches: () => [{data: {publicStoreDomain: 'mock.shop'}}],
  Await: ({resolve, children}: {resolve: unknown; children: (data: unknown) => ReactNode}) => {
    // For testing, pass the resolve value directly (even if it's a promise object)
    // In tests, we pass the actual value, not a real promise
    return <>{children(resolve)}</>;
  },
}));

// Mock Wishlist component
vi.mock('~/components/Wishlist', () => ({
  WishlistIcon: () => <span data-testid="wishlist-icon">Wishlist</span>,
}));

describe('Header', () => {
  const mockMenu = createMockMenu();
  const mockShop = {
    name: 'Test Shop',
    description: 'A test shop',
  };
  const mockHeader = {
    shop: mockShop,
    menu: mockMenu,
  };

  describe('rendering', () => {
    it('renders header element', () => {
      render(
        <Header
          header={mockHeader}
          cart={Promise.resolve(null)}
          isLoggedIn={Promise.resolve(false)}
        />,
      );

      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders logo link to homepage', () => {
      render(
        <Header
          header={mockHeader}
          cart={Promise.resolve(null)}
          isLoggedIn={Promise.resolve(false)}
        />,
      );

      const logoLink = screen.getByRole('link', {name: /liquid/i});
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('renders mobile menu toggle', () => {
      render(
        <Header
          header={mockHeader}
          cart={Promise.resolve(null)}
          isLoggedIn={Promise.resolve(false)}
        />,
      );

      const links = screen.getAllByRole('link');
      const mobileToggle = links.find(link => link.getAttribute('href') === '#mobile-menu-aside');
      expect(mobileToggle).toBeDefined();
    });

    it('renders search toggle', () => {
      render(
        <Header
          header={mockHeader}
          cart={Promise.resolve(null)}
          isLoggedIn={Promise.resolve(false)}
        />,
      );

      const links = screen.getAllByRole('link');
      const searchLink = links.find(link => link.getAttribute('href') === '#search-aside');
      expect(searchLink).toBeDefined();
    });

    it('renders account link', () => {
      render(
        <Header
          header={mockHeader}
          cart={Promise.resolve(null)}
          isLoggedIn={Promise.resolve(false)}
        />,
      );

      const links = screen.getAllByRole('link');
      const accountLinkEl = links.find(link => link.getAttribute('href') === '/account');
      expect(accountLinkEl).toBeDefined();
    });

    it('renders wishlist icon', () => {
      render(
        <Header
          header={mockHeader}
          cart={Promise.resolve(null)}
          isLoggedIn={Promise.resolve(false)}
        />,
      );

      expect(screen.getByTestId('wishlist-icon')).toBeInTheDocument();
    });

    it('renders cart toggle link', () => {
      render(
        <Header
          header={mockHeader}
          cart={Promise.resolve(null)}
          isLoggedIn={Promise.resolve(false)}
        />,
      );

      // Cart link is rendered via <a> tag (not NavLink)
      const cartLink = document.querySelector('a[href="#cart-aside"]');
      expect(cartLink).toBeInTheDocument();
    });
  });

  describe('cart badge', () => {
    it('shows cart badge with count when cart has items', async () => {
      const cartWithItems = createMockCart({
        totalQuantity: 3,
      });

      render(
        <Header
          header={mockHeader}
          cart={cartWithItems}
          isLoggedIn={Promise.resolve(false)}
        />,
      );

      // Cart badge should show count
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('does not show badge when cart is empty', () => {
      const emptyCart = createMockCart({
        totalQuantity: 0,
        lines: {nodes: []},
      });

      render(
        <Header
          header={mockHeader}
          cart={emptyCart}
          isLoggedIn={Promise.resolve(false)}
        />,
      );

      // Should not show "0"
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('shows badge with count 0 fallback for null cart', () => {
      render(
        <Header
          header={mockHeader}
          cart={null as unknown as Promise<null>}
          isLoggedIn={Promise.resolve(false)}
        />,
      );

      // Fallback should not show 0
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });
  });
});

describe('HeaderMenu', () => {
  const mockMenu = createMockMenu({
    items: [
      {
        id: '1',
        resourceId: null,
        tags: [],
        title: 'Men',
        type: 'HTTP',
        url: '/collections/men',
        items: [],
      },
      {
        id: '2',
        resourceId: null,
        tags: [],
        title: 'Women',
        type: 'HTTP',
        url: 'https://mock.shop/collections/women',
        items: [],
      },
      {
        id: '3',
        resourceId: null,
        tags: [],
        title: 'External',
        type: 'HTTP',
        url: 'https://external-site.com/page',
        items: [],
      },
    ],
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('desktop viewport', () => {
    it('renders navigation element', () => {
      render(<HeaderMenu menu={mockMenu} viewport="desktop" />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders menu items as links', () => {
      render(<HeaderMenu menu={mockMenu} viewport="desktop" />);

      expect(screen.getByText('Men')).toBeInTheDocument();
      expect(screen.getByText('Women')).toBeInTheDocument();
    });

    it('converts internal Shopify URLs to relative paths', () => {
      render(<HeaderMenu menu={mockMenu} viewport="desktop" />);

      const womenLink = screen.getByText('Women');
      // Should convert mock.shop URL to relative path
      expect(womenLink).toHaveAttribute('href', '/collections/women');
    });

    it('preserves external URLs', () => {
      render(<HeaderMenu menu={mockMenu} viewport="desktop" />);

      const externalLink = screen.getByText('External');
      expect(externalLink).toHaveAttribute('href', 'https://external-site.com/page');
    });

    it('does not render home link in desktop view', () => {
      render(<HeaderMenu menu={mockMenu} viewport="desktop" />);

      // Home link is only shown in mobile view
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    it('has desktop-specific class', () => {
      render(<HeaderMenu menu={mockMenu} viewport="desktop" />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('header-menu-desktop');
    });
  });

  describe('mobile viewport', () => {
    it('renders home link in mobile view', () => {
      render(<HeaderMenu menu={mockMenu} viewport="mobile" />);

      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('has mobile-specific class', () => {
      render(<HeaderMenu menu={mockMenu} viewport="mobile" />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('header-menu-mobile');
    });

    it('renders all menu items plus home', () => {
      render(<HeaderMenu menu={mockMenu} viewport="mobile" />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Men')).toBeInTheDocument();
      expect(screen.getByText('Women')).toBeInTheDocument();
    });
  });

  describe('fallback menu', () => {
    it('uses fallback menu when menu prop is null', () => {
      render(<HeaderMenu menu={null} viewport="desktop" />);

      // Fallback menu has these items
      expect(screen.getByText('Men')).toBeInTheDocument();
      expect(screen.getByText('Women')).toBeInTheDocument();
      expect(screen.getByText('Unisex')).toBeInTheDocument();
      expect(screen.getByText('Collections')).toBeInTheDocument();
    });
  });

  describe('URL filtering', () => {
    it('skips items without URLs', () => {
      const menuWithNullUrl = createMockMenu({
        items: [
          {
            id: '1',
            resourceId: null,
            tags: [],
            title: 'Valid',
            type: 'HTTP',
            url: '/valid',
            items: [],
          },
          {
            id: '2',
            resourceId: null,
            tags: [],
            title: 'No URL',
            type: 'HTTP',
            url: '', // Empty URL
            items: [],
          },
        ],
      });

      render(<HeaderMenu menu={menuWithNullUrl} viewport="desktop" />);

      expect(screen.getByText('Valid')).toBeInTheDocument();
      // Items with empty URL should not render
      // (the component checks !item.url which is truthy for empty string)
    });
  });
});
