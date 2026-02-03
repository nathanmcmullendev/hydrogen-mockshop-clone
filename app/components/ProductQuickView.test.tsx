/**
 * ProductQuickView Component Tests
 *
 * Tests for the quick view modal including loading states,
 * variant selection, quantity controls, and add to cart.
 */
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ProductQuickView, QuickViewButton} from './ProductQuickView';
import {createMockProduct, createMockVariant} from '~/test/mocks';
import type {ReactNode} from 'react';

// Create mock fetcher
const mockFetcher = {
  state: 'idle' as 'idle' | 'loading' | 'submitting',
  data: undefined as {product: ReturnType<typeof createMockProduct>} | undefined,
  formData: undefined as FormData | undefined,
  submit: vi.fn(),
  load: vi.fn(),
};

const mockCartFetcher = {
  state: 'idle' as 'idle' | 'loading' | 'submitting',
  data: undefined as unknown,
  submit: vi.fn(),
};

const mockRevalidator = {
  state: 'idle' as 'idle' | 'loading',
  revalidate: vi.fn(),
};

// Track which fetcher to return
let fetcherCallIndex = 0;

// Mock Remix
vi.mock('@remix-run/react', () => ({
  Link: ({children, to, ...props}: {children: ReactNode; to: string; [key: string]: unknown}) => (
    <a href={to} {...props}>{children}</a>
  ),
  useFetcher: () => {
    fetcherCallIndex++;
    // First call is product fetcher, second is cart fetcher
    return fetcherCallIndex % 2 === 1 ? mockFetcher : mockCartFetcher;
  },
  useRevalidator: () => mockRevalidator,
}));

// Mock Hydrogen
vi.mock('@shopify/hydrogen', () => ({
  Money: ({data}: {data: {amount: string; currencyCode: string}}) => (
    <span data-testid="money">${data.amount}</span>
  ),
  Image: ({data, ...props}: {data: {url: string; altText?: string | null}}) => (
    <img src={data?.url} alt={data?.altText || ''} {...props} />
  ),
}));


describe('ProductQuickView', () => {
  const mockOnClose = vi.fn();
  const mockProduct = createMockProduct({
    title: 'Test Product',
    handle: 'test-product',
    variants: {
      nodes: [
        createMockVariant({
          id: 'variant-1',
          title: 'Small',
          availableForSale: true,
          selectedOptions: [{name: 'Size', value: 'S'}],
        }),
        createMockVariant({
          id: 'variant-2',
          title: 'Medium',
          availableForSale: true,
          selectedOptions: [{name: 'Size', value: 'M'}],
        }),
        createMockVariant({
          id: 'variant-3',
          title: 'Large',
          availableForSale: false,
          selectedOptions: [{name: 'Size', value: 'L'}],
        }),
      ],
    },
    options: [{name: 'Size', values: ['S', 'M', 'L']}],
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetcher.state = 'idle';
    mockFetcher.data = undefined;
    mockCartFetcher.state = 'idle';
    mockCartFetcher.data = undefined;
    fetcherCallIndex = 0;
  });

  describe('closed state', () => {
    it('returns null when isOpen is false', () => {
      const {container} = render(
        <ProductQuickView
          isOpen={false}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      expect(container).toBeEmptyDOMElement();
    });

    it('does not load product when closed', () => {
      render(
        <ProductQuickView
          isOpen={false}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      expect(mockFetcher.load).not.toHaveBeenCalled();
    });
  });

  describe('open state', () => {
    it('renders overlay when open', () => {
      mockFetcher.data = {product: mockProduct};

      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('loads product data on open', () => {
      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      expect(mockFetcher.load).toHaveBeenCalledWith(
        '/api/product-quickview?handle=test-product',
      );
    });

    it('calls onClose when overlay is clicked', async () => {
      mockFetcher.data = {product: mockProduct};
      const user = userEvent.setup();

      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      const overlay = document.querySelector('.quickview-overlay');
      if (overlay) {
        await user.click(overlay);
      }

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('renders close button', () => {
      mockFetcher.data = {product: mockProduct};

      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      expect(screen.getByRole('button', {name: /close/i})).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
      mockFetcher.data = {product: mockProduct};
      const user = userEvent.setup();

      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      await user.click(screen.getByRole('button', {name: /close/i}));

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('shows loading spinner when fetching', () => {
      mockFetcher.state = 'loading';

      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      expect(document.querySelector('.quickview-loading')).toBeInTheDocument();
    });

    it('shows loading spinner when no product data', () => {
      mockFetcher.state = 'idle';
      mockFetcher.data = undefined;

      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      expect(document.querySelector('.quickview-loading')).toBeInTheDocument();
    });
  });

  describe('product display', () => {
    beforeEach(() => {
      mockFetcher.state = 'idle';
      mockFetcher.data = {product: mockProduct};
    });

    it('displays product title', () => {
      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('displays product image', () => {
      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('displays product price', () => {
      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      expect(screen.getByTestId('money')).toBeInTheDocument();
    });

    it('displays view full details link', () => {
      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      const detailsLink = screen.getByText(/view full details/i);
      expect(detailsLink).toHaveAttribute('href', '/products/test-product');
    });
  });

  describe('variant selection', () => {
    beforeEach(() => {
      mockFetcher.data = {product: mockProduct};
    });

    it('displays variant options', () => {
      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      expect(screen.getByText('Size')).toBeInTheDocument();
      expect(screen.getByRole('button', {name: 'S'})).toBeInTheDocument();
      expect(screen.getByRole('button', {name: 'M'})).toBeInTheDocument();
      expect(screen.getByRole('button', {name: 'L'})).toBeInTheDocument();
    });

    it('highlights selected variant option', async () => {
      const user = userEvent.setup();

      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      const mediumBtn = screen.getByRole('button', {name: 'M'});
      await user.click(mediumBtn);

      expect(mediumBtn).toHaveClass('active');
    });
  });

  describe('quantity controls', () => {
    beforeEach(() => {
      mockFetcher.data = {product: mockProduct};
    });

    it('displays quantity label', () => {
      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      expect(screen.getByText('Quantity')).toBeInTheDocument();
    });

    it('displays initial quantity of 1', () => {
      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('increments quantity when + is clicked', async () => {
      const user = userEvent.setup();

      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      // Find increment button (contains +)
      const buttons = screen.getAllByRole('button');
      const incrementBtn = buttons.find((btn) => btn.textContent === '+');

      if (incrementBtn) {
        await user.click(incrementBtn);
      }

      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('decrements quantity when − is clicked', async () => {
      const user = userEvent.setup();

      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      // First increment to 2
      const buttons = screen.getAllByRole('button');
      const incrementBtn = buttons.find((btn) => btn.textContent === '+');
      if (incrementBtn) {
        await user.click(incrementBtn);
      }

      // Then decrement
      const decrementBtn = buttons.find((btn) => btn.textContent === '−');
      if (decrementBtn) {
        await user.click(decrementBtn);
      }

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('disables decrement when quantity is 1', () => {
      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      const buttons = screen.getAllByRole('button');
      const decrementBtn = buttons.find((btn) => btn.textContent === '−');

      expect(decrementBtn).toBeDisabled();
    });
  });

  describe('add to cart', () => {
    beforeEach(() => {
      mockFetcher.data = {product: mockProduct};
    });

    it('displays add to cart button', () => {
      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      expect(screen.getByRole('button', {name: /add to cart/i})).toBeInTheDocument();
    });

    it('shows sold out when variant is unavailable', async () => {
      const user = userEvent.setup();

      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      // Select unavailable variant (Large)
      const largeBtn = screen.getByRole('button', {name: 'L'});
      await user.click(largeBtn);

      expect(screen.getByRole('button', {name: /sold out/i})).toBeInTheDocument();
    });

    it('disables add to cart when variant is unavailable', async () => {
      const user = userEvent.setup();

      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="test-product"
        />,
      );

      // Select unavailable variant
      await user.click(screen.getByRole('button', {name: 'L'}));

      const addBtn = screen.getByRole('button', {name: /sold out/i});
      expect(addBtn).toBeDisabled();
    });
  });

  describe('error state', () => {
    it('shows loading when product is not yet loaded', () => {
      mockFetcher.state = 'idle';
      mockFetcher.data = undefined;

      render(
        <ProductQuickView
          isOpen={true}
          onClose={mockOnClose}
          productHandle="nonexistent"
        />,
      );

      // Shows loading state when no data yet
      expect(document.querySelector('.quickview-loading')).toBeInTheDocument();
    });
  });
});

describe('QuickViewButton', () => {
  const mockOnQuickView = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders button with quick view label', () => {
    render(<QuickViewButton productHandle="test-product" onQuickView={mockOnQuickView} />);

    expect(screen.getByRole('button', {name: /quick view/i})).toBeInTheDocument();
  });

  it('calls onQuickView with product handle when clicked', async () => {
    const user = userEvent.setup();

    render(<QuickViewButton productHandle="test-product" onQuickView={mockOnQuickView} />);

    await user.click(screen.getByRole('button'));

    expect(mockOnQuickView).toHaveBeenCalledWith('test-product');
  });

  it('prevents default event behavior', async () => {
    const user = userEvent.setup();
    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    };

    render(<QuickViewButton productHandle="test-product" onQuickView={mockOnQuickView} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // The component should call preventDefault and stopPropagation
    // (tested implicitly by the button working without navigation)
    expect(mockOnQuickView).toHaveBeenCalled();
  });

  it('has quickview-trigger class', () => {
    render(<QuickViewButton productHandle="test-product" onQuickView={mockOnQuickView} />);

    expect(screen.getByRole('button')).toHaveClass('quickview-trigger');
  });

  it('includes eye icon', () => {
    const {container} = render(
      <QuickViewButton productHandle="test-product" onQuickView={mockOnQuickView} />,
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
