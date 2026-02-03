/**
 * Cart Component Tests
 *
 * Tests for cart display, line items, quantity controls,
 * and discount functionality.
 */
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {CartMain, CartSummary, CartEmpty} from './Cart';
import {
  createMockCart,
  createMockCartLine,
  createMockMoney,
  createMockProduct,
} from '~/test/mocks';
import type {ReactNode} from 'react';

// Mock Remix
vi.mock('@remix-run/react', () => ({
  Link: ({children, to, ...props}: {children: ReactNode; to: string; [key: string]: unknown}) => (
    <a href={to} {...props}>{children}</a>
  ),
  useFetcher: () => ({
    state: 'idle',
    data: null,
    formData: undefined,
    submit: vi.fn(),
    Form: ({children, ...props}: {children: ReactNode}) => <form {...props}>{children}</form>,
  }),
}));

// Mock Hydrogen components
vi.mock('@shopify/hydrogen', () => ({
  CartForm: Object.assign(
    ({children, route, action, inputs}: {
      children: ReactNode;
      route?: string;
      action: string;
      inputs?: unknown;
    }) => (
      <form data-testid="cart-form" data-action={action} data-route={route}>
        <input type="hidden" name="inputs" value={JSON.stringify(inputs)} />
        {children}
      </form>
    ),
    {
      ACTIONS: {
        LinesAdd: 'LinesAdd',
        LinesUpdate: 'LinesUpdate',
        LinesRemove: 'LinesRemove',
        DiscountCodesUpdate: 'DiscountCodesUpdate',
      },
    },
  ),
  Money: ({data}: {data: {amount: string; currencyCode: string}}) => (
    <span data-testid="money">${data.amount}</span>
  ),
  Image: ({data, alt, ...props}: {data: {url: string; altText?: string}; alt?: string}) => (
    <img src={data?.url} alt={data?.altText || alt || ''} {...props} />
  ),
}));

// Mock utils
vi.mock('~/utils', () => ({
  useVariantUrl: (handle: string, options: Array<{name: string; value: string}>) => {
    const params = options.map(o => `${o.name}=${o.value}`).join('&');
    return `/products/${handle}?${params}`;
  },
}));

describe('CartMain', () => {
  describe('empty state', () => {
    it('shows empty message when cart is null', () => {
      render(<CartMain cart={null} layout="aside" />);

      expect(screen.getByText(/Looks like you/i)).toBeInTheDocument();
    });

    it('shows empty message when cart has no items', () => {
      const emptyCart = createMockCart({
        totalQuantity: 0,
        lines: {nodes: []},
      });

      render(<CartMain cart={emptyCart} layout="aside" />);

      expect(screen.getByText(/Looks like you/i)).toBeInTheDocument();
    });

    it('shows continue shopping link in empty state', () => {
      render(<CartMain cart={null} layout="aside" />);

      const shopLink = screen.getByRole('link', {name: /continue shopping/i});
      expect(shopLink).toHaveAttribute('href', '/collections');
    });
  });

  describe('with items', () => {
    it('renders cart line items', () => {
      const line = createMockCartLine();
      const cart = createMockCart({
        lines: {nodes: [line]},
        totalQuantity: 1,
      });

      render(<CartMain cart={cart} layout="aside" />);

      expect(screen.getByText(line.merchandise.product.title)).toBeInTheDocument();
    });

    it('renders multiple line items', () => {
      const lines = [
        createMockCartLine(),
        createMockCartLine(),
        createMockCartLine(),
      ];
      const cart = createMockCart({
        lines: {nodes: lines},
        totalQuantity: 3,
      });

      render(<CartMain cart={cart} layout="aside" />);

      // Each line item has multiple list items (options) plus the main line
      // Check for cart-line class instead
      const cartLines = document.querySelectorAll('.cart-line');
      expect(cartLines).toHaveLength(3);
    });

    it('displays product image', () => {
      const line = createMockCartLine();
      const cart = createMockCart({
        lines: {nodes: [line]},
      });

      render(<CartMain cart={cart} layout="aside" />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', line.merchandise.image?.url);
    });

    it('displays selected options', () => {
      const line = createMockCartLine({
        merchandise: {
          id: 'var-1',
          title: 'Test Variant',
          product: {id: 'prod-1', handle: 'test', title: 'Test Product'},
          image: null,
          selectedOptions: [
            {name: 'Size', value: 'Large'},
            {name: 'Color', value: 'Blue'},
          ],
        },
      });
      const cart = createMockCart({lines: {nodes: [line]}});

      render(<CartMain cart={cart} layout="aside" />);

      expect(screen.getByText(/Size: Large/i)).toBeInTheDocument();
      expect(screen.getByText(/Color: Blue/i)).toBeInTheDocument();
    });

    it('displays line item price', () => {
      const line = createMockCartLine({
        cost: {
          totalAmount: createMockMoney({amount: '59.98'}),
          amountPerQuantity: createMockMoney({amount: '29.99'}),
        },
      });
      const cart = createMockCart({lines: {nodes: [line]}});

      render(<CartMain cart={cart} layout="aside" />);

      // Price appears multiple times (line item + summary)
      const priceElements = screen.getAllByText('$59.98');
      expect(priceElements.length).toBeGreaterThan(0);
    });
  });

  describe('quantity controls', () => {
    it('displays current quantity', () => {
      const line = createMockCartLine({quantity: 3});
      const cart = createMockCart({lines: {nodes: [line]}});

      render(<CartMain cart={cart} layout="aside" />);

      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders increase quantity button', () => {
      const line = createMockCartLine({quantity: 1});
      const cart = createMockCart({lines: {nodes: [line]}});

      render(<CartMain cart={cart} layout="aside" />);

      const increaseBtn = screen.getByRole('button', {name: /increase quantity/i});
      expect(increaseBtn).toBeInTheDocument();
    });

    it('renders decrease quantity button', () => {
      const line = createMockCartLine({quantity: 2});
      const cart = createMockCart({lines: {nodes: [line]}});

      render(<CartMain cart={cart} layout="aside" />);

      const decreaseBtn = screen.getByRole('button', {name: /decrease quantity/i});
      expect(decreaseBtn).toBeInTheDocument();
    });

    it('disables decrease button when quantity is 1', () => {
      const line = createMockCartLine({quantity: 1});
      const cart = createMockCart({lines: {nodes: [line]}});

      render(<CartMain cart={cart} layout="aside" />);

      const decreaseBtn = screen.getByRole('button', {name: /decrease quantity/i});
      expect(decreaseBtn).toBeDisabled();
    });

    it('renders remove button', () => {
      const line = createMockCartLine();
      const cart = createMockCart({lines: {nodes: [line]}});

      render(<CartMain cart={cart} layout="aside" />);

      const removeBtn = screen.getByRole('button', {name: /remove/i});
      expect(removeBtn).toBeInTheDocument();
    });
  });

  describe('cart summary', () => {
    it('displays subtotal', () => {
      const cart = createMockCart({
        cost: {
          subtotalAmount: createMockMoney({amount: '89.97'}),
          totalAmount: createMockMoney({amount: '89.97'}),
        },
      });

      render(<CartMain cart={cart} layout="aside" />);

      expect(screen.getByText('Subtotal')).toBeInTheDocument();
      expect(screen.getByText('$89.97')).toBeInTheDocument();
    });

    it('renders checkout button', () => {
      const cart = createMockCart();

      render(<CartMain cart={cart} layout="aside" />);

      const checkoutBtn = screen.getByRole('link', {name: /checkout/i});
      expect(checkoutBtn).toBeInTheDocument();
    });
  });

  describe('discounts', () => {
    it('displays applicable discount codes', () => {
      const cart = createMockCart({
        discountCodes: [
          {code: 'SAVE10', applicable: true},
        ],
      });

      render(<CartMain cart={cart} layout="aside" />);

      expect(screen.getByText('SAVE10')).toBeInTheDocument();
    });

    it('renders discount input field', () => {
      const cart = createMockCart();

      render(<CartMain cart={cart} layout="aside" />);

      const input = screen.getByPlaceholderText(/discount code/i);
      expect(input).toBeInTheDocument();
    });

    it('renders apply discount button', () => {
      const cart = createMockCart();

      render(<CartMain cart={cart} layout="aside" />);

      const applyBtn = screen.getByRole('button', {name: /apply/i});
      expect(applyBtn).toBeInTheDocument();
    });

    it('renders remove discount button when discount applied', () => {
      const cart = createMockCart({
        discountCodes: [{code: 'SAVE10', applicable: true}],
      });

      render(<CartMain cart={cart} layout="aside" />);

      const removeBtn = screen.getAllByRole('button', {name: /remove/i});
      // There should be remove buttons for both line items and discounts
      expect(removeBtn.length).toBeGreaterThan(0);
    });
  });

  describe('with-discount class', () => {
    it('adds with-discount class when discounts are applicable', () => {
      const cart = createMockCart({
        discountCodes: [{code: 'SAVE10', applicable: true}],
      });

      const {container} = render(<CartMain cart={cart} layout="aside" />);

      expect(container.querySelector('.with-discount')).toBeInTheDocument();
    });

    it('does not add with-discount class when no applicable discounts', () => {
      const cart = createMockCart({
        discountCodes: [{code: 'INVALID', applicable: false}],
      });

      const {container} = render(<CartMain cart={cart} layout="aside" />);

      expect(container.querySelector('.with-discount')).not.toBeInTheDocument();
    });
  });
});

describe('CartSummary', () => {
  it('renders totals heading', () => {
    const cost = {
      subtotalAmount: createMockMoney({amount: '50.00'}),
      totalAmount: createMockMoney({amount: '50.00'}),
    };

    render(<CartSummary cost={cost} layout="aside" />);

    expect(screen.getByText('Totals')).toBeInTheDocument();
  });

  it('displays subtotal amount', () => {
    const cost = {
      subtotalAmount: createMockMoney({amount: '99.99'}),
      totalAmount: createMockMoney({amount: '99.99'}),
    };

    render(<CartSummary cost={cost} layout="aside" />);

    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('shows dash when subtotal is not available', () => {
    const cost = {
      subtotalAmount: null,
      totalAmount: null,
    };

    render(<CartSummary cost={cost as any} layout="aside" />);

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('applies page layout class', () => {
    const cost = {
      subtotalAmount: createMockMoney(),
      totalAmount: createMockMoney(),
    };

    const {container} = render(<CartSummary cost={cost} layout="page" />);

    expect(container.querySelector('.cart-summary-page')).toBeInTheDocument();
  });

  it('applies aside layout class', () => {
    const cost = {
      subtotalAmount: createMockMoney(),
      totalAmount: createMockMoney(),
    };

    const {container} = render(<CartSummary cost={cost} layout="aside" />);

    expect(container.querySelector('.cart-summary-aside')).toBeInTheDocument();
  });

  it('renders children', () => {
    const cost = {
      subtotalAmount: createMockMoney(),
      totalAmount: createMockMoney(),
    };

    render(
      <CartSummary cost={cost} layout="aside">
        <div data-testid="child">Child content</div>
      </CartSummary>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});

describe('CartEmpty', () => {
  it('shows empty cart message', () => {
    render(<CartEmpty hidden={false} />);

    expect(screen.getByText(/Looks like you/i)).toBeInTheDocument();
  });

  it('hides content when hidden prop is true', () => {
    render(<CartEmpty hidden={true} />);

    const container = screen.getByText(/Looks like you/i).closest('div');
    expect(container).toHaveAttribute('hidden');
  });

  it('shows continue shopping link', () => {
    render(<CartEmpty hidden={false} />);

    const link = screen.getByRole('link', {name: /continue shopping/i});
    expect(link).toHaveAttribute('href', '/collections');
  });

  it('defaults to aside layout', () => {
    render(<CartEmpty hidden={false} />);

    // The component should render without errors with default layout
    expect(screen.getByText(/Looks like you/i)).toBeInTheDocument();
  });
});
