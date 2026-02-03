/**
 * Search Component Tests
 *
 * Tests for search form, predictive search, and search results.
 */
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  SearchForm,
  SearchResults,
  NoSearchResults,
  PredictiveSearchForm,
  PredictiveSearchResults,
  NO_PREDICTIVE_SEARCH_RESULTS,
} from './Search';
import type {ReactNode} from 'react';

// Mock fetcher
const mockFetcher = {
  state: 'idle' as 'idle' | 'loading' | 'submitting',
  data: undefined as unknown,
  formData: undefined as FormData | undefined,
  submit: vi.fn(),
  Form: ({children, ...props}: {children: ReactNode}) => <form {...props}>{children}</form>,
};

// Mock Remix
vi.mock('@remix-run/react', () => ({
  Link: ({children, to, ...props}: {children: ReactNode; to: string; [key: string]: unknown}) => (
    <a href={to} {...props}>{children}</a>
  ),
  Form: ({children, ...props}: {children: ReactNode}) => <form {...props}>{children}</form>,
  useParams: () => ({}),
  useFetcher: () => mockFetcher,
  useFetchers: () => [],
}));

// Mock Hydrogen
vi.mock('@shopify/hydrogen', () => ({
  Money: ({data}: {data: {amount: string}}) => <span>${data.amount}</span>,
  Image: ({src, alt}: {src: string; alt: string}) => <img src={src} alt={alt} />,
  Pagination: ({connection, children}: {connection: {nodes: unknown[]}; children: Function}) => {
    const MockLink = ({children}: {children: ReactNode}) => <button>{children}</button>;
    return children({
      nodes: connection.nodes,
      isLoading: false,
      NextLink: MockLink,
      PreviousLink: MockLink,
    });
  },
}));

describe('SearchForm', () => {
  it('renders search input', () => {
    render(<SearchForm searchTerm="" />);

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('renders search button', () => {
    render(<SearchForm searchTerm="" />);

    expect(screen.getByRole('button', {name: /search/i})).toBeInTheDocument();
  });

  it('sets initial search term as default value', () => {
    render(<SearchForm searchTerm="test query" />);

    expect(screen.getByRole('searchbox')).toHaveValue('test query');
  });

  it('has placeholder text', () => {
    render(<SearchForm searchTerm="" />);

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('uses GET method for form', () => {
    render(<SearchForm searchTerm="" />);

    const form = screen.getByRole('searchbox').closest('form');
    expect(form).toHaveAttribute('method', 'get');
  });

  it('input has name "q" for query parameter', () => {
    render(<SearchForm searchTerm="" />);

    expect(screen.getByRole('searchbox')).toHaveAttribute('name', 'q');
  });

  describe('keyboard shortcuts', () => {
    beforeEach(() => {
      vi.useFakeTimers({shouldAdvanceTime: true});
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('focuses input on Cmd+K', async () => {
      render(<SearchForm searchTerm="" />);

      const input = screen.getByRole('searchbox');

      // Simulate Cmd+K
      fireEvent.keyDown(document, {key: 'k', metaKey: true});

      // Input should be focused
      await waitFor(() => {
        expect(document.activeElement).toBe(input);
      });
    });

    it('blurs input on Escape', async () => {
      render(<SearchForm searchTerm="" />);

      const input = screen.getByRole('searchbox');
      input.focus();

      expect(document.activeElement).toBe(input);

      // Press Escape
      fireEvent.keyDown(document, {key: 'Escape'});

      expect(document.activeElement).not.toBe(input);
    });
  });
});

describe('SearchResults', () => {
  it('returns null when results is null', () => {
    const {container} = render(<SearchResults results={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders product results', () => {
    const results = {
      products: {
        nodes: [
          {__typename: 'Product', id: '1', handle: 'product-1', title: 'Product 1'},
          {__typename: 'Product', id: '2', handle: 'product-2', title: 'Product 2'},
        ],
      },
    } as any;

    render(<SearchResults results={results} />);

    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('renders page results', () => {
    const results = {
      pages: {
        nodes: [
          {__typename: 'Page', id: '1', handle: 'about', title: 'About Us'},
        ],
      },
    } as any;

    render(<SearchResults results={results} />);

    expect(screen.getByText('Pages')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  it('renders article results', () => {
    const results = {
      articles: {
        nodes: [
          {__typename: 'Article', id: '1', handle: 'blog-post', title: 'Blog Post'},
        ],
      },
    } as any;

    render(<SearchResults results={results} />);

    expect(screen.getByText('Articles')).toBeInTheDocument();
    expect(screen.getByText('Blog Post')).toBeInTheDocument();
  });

  it('links products to product pages', () => {
    const results = {
      products: {
        nodes: [
          {__typename: 'Product', id: '1', handle: 'test-product', title: 'Test Product'},
        ],
      },
    } as any;

    render(<SearchResults results={results} />);

    const link = screen.getByRole('link', {name: 'Test Product'});
    expect(link).toHaveAttribute('href', '/products/test-product');
  });

  it('links pages to page URLs', () => {
    const results = {
      pages: {
        nodes: [
          {__typename: 'Page', id: '1', handle: 'contact', title: 'Contact'},
        ],
      },
    } as any;

    render(<SearchResults results={results} />);

    const link = screen.getByRole('link', {name: 'Contact'});
    expect(link).toHaveAttribute('href', '/pages/contact');
  });
});

describe('NoSearchResults', () => {
  it('displays no results message', () => {
    render(<NoSearchResults />);

    expect(screen.getByText(/no results/i)).toBeInTheDocument();
  });

  it('suggests trying different search', () => {
    render(<NoSearchResults />);

    expect(screen.getByText(/different search/i)).toBeInTheDocument();
  });
});

describe('PredictiveSearchForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetcher.submit.mockClear();
  });

  it('renders children with render props', () => {
    render(
      <PredictiveSearchForm>
        {({fetchResults, inputRef}) => (
          <input
            ref={inputRef}
            onChange={fetchResults}
            data-testid="search-input"
          />
        )}
      </PredictiveSearchForm>,
    );

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('calls fetchResults on input change', async () => {
    const user = userEvent.setup();

    render(
      <PredictiveSearchForm>
        {({fetchResults, inputRef}) => (
          <input
            ref={inputRef}
            onChange={fetchResults}
            data-testid="search-input"
          />
        )}
      </PredictiveSearchForm>,
    );

    const input = screen.getByTestId('search-input');
    await user.type(input, 'test');

    expect(mockFetcher.submit).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const {container} = render(
      <PredictiveSearchForm className="custom-search">
        {() => <input />}
      </PredictiveSearchForm>,
    );

    expect(container.querySelector('.custom-search')).toBeInTheDocument();
  });

  it('uses default className', () => {
    const {container} = render(
      <PredictiveSearchForm>
        {() => <input />}
      </PredictiveSearchForm>,
    );

    expect(container.querySelector('.predictive-search-form')).toBeInTheDocument();
  });

  it('prevents form submission with empty input', async () => {
    const user = userEvent.setup();

    render(
      <PredictiveSearchForm>
        {({inputRef}) => (
          <>
            <input ref={inputRef} data-testid="search-input" />
            <button type="submit">Submit</button>
          </>
        )}
      </PredictiveSearchForm>,
    );

    const form = screen.getByTestId('search-input').closest('form');
    const submitEvent = new Event('submit', {bubbles: true, cancelable: true});

    fireEvent(form!, submitEvent);

    // Form should prevent default
    expect(submitEvent.defaultPrevented).toBe(true);
  });

  it('submits search with limit parameter', async () => {
    const user = userEvent.setup();

    render(
      <PredictiveSearchForm>
        {({fetchResults, inputRef}) => (
          <input
            ref={inputRef}
            onChange={fetchResults}
            data-testid="search-input"
          />
        )}
      </PredictiveSearchForm>,
    );

    await user.type(screen.getByTestId('search-input'), 'test');

    // Should submit with q and limit params
    expect(mockFetcher.submit).toHaveBeenCalledWith(
      expect.objectContaining({q: expect.any(String), limit: '6'}),
      expect.any(Object),
    );
  });
});

describe('NO_PREDICTIVE_SEARCH_RESULTS constant', () => {
  it('has correct structure', () => {
    expect(NO_PREDICTIVE_SEARCH_RESULTS).toHaveLength(5);

    const types = NO_PREDICTIVE_SEARCH_RESULTS.map((r) => r.type);
    expect(types).toContain('queries');
    expect(types).toContain('products');
    expect(types).toContain('collections');
    expect(types).toContain('pages');
    expect(types).toContain('articles');
  });

  it('has empty items arrays', () => {
    NO_PREDICTIVE_SEARCH_RESULTS.forEach((result) => {
      expect(result.items).toEqual([]);
    });
  });
});
