/**
 * Mock Data Factories for Tests
 *
 * These factories create consistent, reusable test data that matches
 * the Shopify Storefront API types used throughout the application.
 *
 * LEARNING: Factory Pattern for Test Data
 * - Create sensible defaults that work out of the box
 * - Allow overrides for specific test scenarios
 * - Keep mock data realistic to catch real bugs
 */
import type {
  CurrencyCode,
  MoneyV2,
} from '@shopify/hydrogen/storefront-api-types';

// ============================================
// CORE TYPES
// ============================================

export interface MockMoney {
  amount: string;
  currencyCode: CurrencyCode;
}

export interface MockImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface MockSelectedOption {
  name: string;
  value: string;
}

// ============================================
// MONEY & PRICE
// ============================================

let moneyCounter = 0;

export function createMockMoney(overrides: Partial<MockMoney> = {}): MockMoney {
  return {
    amount: '29.99',
    currencyCode: 'USD' as CurrencyCode,
    ...overrides,
  };
}

export function createMockPriceRange(minPrice?: Partial<MockMoney>) {
  return {
    minVariantPrice: createMockMoney(minPrice),
    maxVariantPrice: createMockMoney({amount: '49.99', ...minPrice}),
  };
}

// ============================================
// IMAGES
// ============================================

let imageCounter = 0;

export function createMockImage(overrides: Partial<MockImage> = {}): MockImage {
  imageCounter++;
  return {
    url: `https://cdn.shopify.com/test-image-${imageCounter}.jpg`,
    altText: `Test image ${imageCounter}`,
    width: 800,
    height: 800,
    ...overrides,
  };
}

// ============================================
// PRODUCT VARIANTS
// ============================================

let variantCounter = 0;

export interface MockVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: MockMoney;
  compareAtPrice?: MockMoney | null;
  image?: MockImage | null;
  selectedOptions: MockSelectedOption[];
}

export function createMockVariant(
  overrides: Partial<MockVariant> = {},
): MockVariant {
  variantCounter++;
  return {
    id: `gid://shopify/ProductVariant/${variantCounter}`,
    title: `Variant ${variantCounter}`,
    availableForSale: true,
    price: createMockMoney(),
    compareAtPrice: null,
    image: createMockImage(),
    selectedOptions: [{name: 'Size', value: 'M'}],
    ...overrides,
  };
}

// ============================================
// PRODUCTS
// ============================================

let productCounter = 0;

export interface MockProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  priceRange: ReturnType<typeof createMockPriceRange>;
  images: {
    nodes: MockImage[];
  };
  variants: {
    nodes: MockVariant[];
  };
  options: Array<{name: string; values: string[]}>;
}

export function createMockProduct(
  overrides: Partial<MockProduct> = {},
): MockProduct {
  productCounter++;
  const id = overrides.id || `gid://shopify/Product/${productCounter}`;
  const handle = overrides.handle || `test-product-${productCounter}`;
  const title = overrides.title || `Test Product ${productCounter}`;

  return {
    id,
    handle,
    title,
    description: `Description for ${title}`,
    descriptionHtml: `<p>Description for ${title}</p>`,
    vendor: 'Test Vendor',
    productType: 'Test Type',
    tags: ['test', 'mock'],
    priceRange: createMockPriceRange(),
    images: {
      nodes: [createMockImage({altText: title})],
    },
    variants: {
      nodes: [
        createMockVariant({title: 'Small', selectedOptions: [{name: 'Size', value: 'S'}]}),
        createMockVariant({title: 'Medium', selectedOptions: [{name: 'Size', value: 'M'}]}),
        createMockVariant({title: 'Large', selectedOptions: [{name: 'Size', value: 'L'}]}),
      ],
    },
    options: [
      {name: 'Size', values: ['S', 'M', 'L']},
    ],
    ...overrides,
  };
}

/**
 * Create a simple product for wishlist/quick scenarios
 */
export function createSimpleMockProduct(overrides: Partial<{
  id: string;
  handle: string;
  title: string;
  price: MockMoney;
  image: MockImage | null;
}> = {}) {
  productCounter++;
  return {
    id: `gid://shopify/Product/${productCounter}`,
    handle: `simple-product-${productCounter}`,
    title: `Simple Product ${productCounter}`,
    price: createMockMoney(),
    image: createMockImage(),
    ...overrides,
  };
}

// ============================================
// CART
// ============================================

let cartLineCounter = 0;

export interface MockCartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: MockMoney;
    amountPerQuantity: MockMoney;
    compareAtAmountPerQuantity?: MockMoney | null;
  };
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      handle: string;
      title: string;
    };
    image?: MockImage | null;
    selectedOptions: MockSelectedOption[];
  };
}

export function createMockCartLine(
  overrides: Partial<MockCartLine> = {},
): MockCartLine {
  cartLineCounter++;
  const product = createMockProduct();
  const variant = product.variants.nodes[0];

  return {
    id: `gid://shopify/CartLine/${cartLineCounter}`,
    quantity: 1,
    cost: {
      totalAmount: createMockMoney(),
      amountPerQuantity: createMockMoney(),
      compareAtAmountPerQuantity: null,
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
      },
      image: variant.image,
      selectedOptions: variant.selectedOptions,
    },
    ...overrides,
  };
}

export interface MockCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: MockMoney;
    totalAmount: MockMoney;
    totalTaxAmount?: MockMoney | null;
  };
  lines: {
    nodes: MockCartLine[];
  };
  discountCodes: Array<{code: string; applicable: boolean}>;
}

export function createMockCart(overrides: Partial<MockCart> = {}): MockCart {
  const lines = overrides.lines?.nodes || [createMockCartLine()];
  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce(
    (sum, line) => sum + parseFloat(line.cost.totalAmount.amount) * line.quantity,
    0,
  );

  return {
    id: 'gid://shopify/Cart/test-cart',
    checkoutUrl: 'https://checkout.test.com',
    totalQuantity,
    cost: {
      subtotalAmount: createMockMoney({amount: subtotal.toFixed(2)}),
      totalAmount: createMockMoney({amount: subtotal.toFixed(2)}),
      totalTaxAmount: null,
    },
    lines: {
      nodes: lines,
    },
    discountCodes: [],
    ...overrides,
  };
}

// ============================================
// COLLECTIONS
// ============================================

let collectionCounter = 0;

export interface MockCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: MockImage | null;
  products: {
    nodes: MockProduct[];
  };
}

export function createMockCollection(
  overrides: Partial<MockCollection> = {},
): MockCollection {
  collectionCounter++;
  return {
    id: `gid://shopify/Collection/${collectionCounter}`,
    handle: `test-collection-${collectionCounter}`,
    title: `Test Collection ${collectionCounter}`,
    description: `Description for collection ${collectionCounter}`,
    image: createMockImage(),
    products: {
      nodes: [createMockProduct(), createMockProduct()],
    },
    ...overrides,
  };
}

// ============================================
// CMS / METAOBJECTS
// ============================================

let sectionCounter = 0;

export type SectionType =
  | 'section_hero'
  | 'section_hero_slider'
  | 'section_featured_products'
  | 'section_collection_grid'
  | 'section_rich_text'
  | 'section_image_with_text'
  | 'section_video'
  | 'section_testimonials'
  | 'section_logos'
  | 'section_faq'
  | 'section_features'
  | 'section_banner'
  | 'section_countdown'
  | 'section_newsletter';

export interface MockSection {
  id: string;
  type: SectionType;
  [key: string]: unknown;
}

export function createMockSection(
  type: SectionType,
  overrides: Partial<MockSection> = {},
): MockSection {
  sectionCounter++;
  return {
    id: `gid://shopify/Metaobject/${sectionCounter}`,
    type,
    ...overrides,
  };
}

export function createMockHeroSection(overrides: Partial<MockSection> = {}) {
  return createMockSection('section_hero', {
    heading: {type: 'single_line_text_field', value: 'Welcome'},
    subheading: {type: 'single_line_text_field', value: 'Shop our collection'},
    backgroundImage: {
      type: 'file_reference',
      reference: createMockImage(),
    },
    buttonText: {type: 'single_line_text_field', value: 'Shop Now'},
    buttonLink: {type: 'single_line_text_field', value: '/collections'},
    ...overrides,
  });
}

export function createMockFeaturedProductsSection(
  overrides: Partial<MockSection> = {},
) {
  return createMockSection('section_featured_products', {
    heading: {type: 'single_line_text_field', value: 'Featured Products'},
    collection: {
      type: 'collection_reference',
      reference: createMockCollection(),
    },
    ...overrides,
  });
}

// ============================================
// MENU / NAVIGATION
// ============================================

export interface MockMenuItem {
  id: string;
  resourceId: string | null;
  tags: string[];
  title: string;
  type: string;
  url: string;
  items: MockMenuItem[];
}

export interface MockMenu {
  id: string;
  items: MockMenuItem[];
}

export function createMockMenuItem(
  overrides: Partial<MockMenuItem> = {},
): MockMenuItem {
  return {
    id: `gid://shopify/MenuItem/${Math.random().toString(36).slice(2)}`,
    resourceId: null,
    tags: [],
    title: 'Menu Item',
    type: 'HTTP',
    url: '/test',
    items: [],
    ...overrides,
  };
}

export function createMockMenu(overrides: Partial<MockMenu> = {}): MockMenu {
  return {
    id: 'gid://shopify/Menu/test-menu',
    items: [
      createMockMenuItem({title: 'Home', url: '/'}),
      createMockMenuItem({title: 'Products', url: '/products'}),
      createMockMenuItem({title: 'Collections', url: '/collections'}),
    ],
    ...overrides,
  };
}

// ============================================
// SEARCH
// ============================================

export interface MockSearchResult {
  __typename: 'Product' | 'Collection' | 'Page' | 'Article';
  id: string;
  handle: string;
  title: string;
  url?: string;
}

export function createMockSearchResults(count = 3): MockSearchResult[] {
  return Array.from({length: count}, (_, i) => ({
    __typename: 'Product' as const,
    id: `gid://shopify/Product/search-${i}`,
    handle: `search-result-${i}`,
    title: `Search Result ${i + 1}`,
    url: `/products/search-result-${i}`,
  }));
}

// ============================================
// RESET COUNTERS (for test isolation)
// ============================================

export function resetMockCounters() {
  moneyCounter = 0;
  imageCounter = 0;
  variantCounter = 0;
  productCounter = 0;
  cartLineCounter = 0;
  collectionCounter = 0;
  sectionCounter = 0;
}
