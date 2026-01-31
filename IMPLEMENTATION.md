# Implementation Notes: Mock.shop → Hydrogen Transformation

> Detailed documentation of how we transformed a standard Hydrogen template into an exact replica of Shopify's official demo store.

---

## The Challenge

**Source:** `demostore.mock.shop` - Built with Dawn theme (Liquid)
**Target:** Hydrogen (React/Remix) with identical UI/UX

Dawn is Shopify's reference theme written in Liquid. This project proves the same design can be achieved in Hydrogen while leveraging React's component model and Remix's data patterns.

---

## Transformation Steps

### 1. Header Restructure

**Dawn Pattern:**
```
[☰ Menu] | [Liquid Logo] | [🔍] [👤] [🛒]
  LEFT        CENTER          RIGHT
```

**Hydrogen Implementation:**
```tsx
// Header.tsx
<header className="header">
  <div className="header-left">
    <HeaderMenuMobileToggle />
    <HeaderMenu menu={menu} viewport="desktop" />
  </div>
  <div className="header-logo">
    <NavLink to="/">
      <img src="https://demostore.mock.shop/cdn/shop/files/newer.gif" alt="Liquid" />
    </NavLink>
  </div>
  <div className="header-right">
    <SearchToggle />
    <AccountLink />
    <CartToggle cart={cart} />
  </div>
</header>
```

**CSS Grid:**
```css
.header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}
```

---

### 2. Search Dropdown (Dawn-style)

**Dawn's search modal features:**
- Top dropdown overlay (not side drawer)
- Bordered input with floating label
- Magnifying glass inside border
- X close button outside border

**Implementation:**
```tsx
// Layout.tsx - SearchDropdown component
function SearchDropdown() {
  return (
    <div id="search-aside" className="search-dropdown-overlay">
      <div className="search-dropdown-backdrop" onClick={close} />
      <div className="search-dropdown">
        <div className="search-modal-content">
          <div className="search-field">
            <input placeholder=" " className="search-field-input" />
            <label className="search-field-label">Search</label>
            <button className="search-field-button">🔍</button>
          </div>
          <button className="search-modal-close">✕</button>
        </div>
        <PredictiveSearchResults />
      </div>
    </div>
  );
}
```

**Floating Label CSS (from Dawn):**
```css
.search-field-label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.15s ease;
}

.search-field-input:focus ~ .search-field-label,
.search-field-input:not(:placeholder-shown) ~ .search-field-label {
  top: 10px;
  transform: translateY(0);
  font-size: 11px;
}
```

---

### 3. Homepage Sections

**Mock.shop structure:**
1. Hero (basketball court image)
2. New Arrivals ("Spring '23")
3. Brand Values (3 text blocks)
4. Midweight Section (full-width dark image)
5. Newsletter (dark section with email input)

**Implementation:**
```tsx
// _index.tsx
export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <HeroSection />
      <NewArrivalsSection products={data.recommendedProducts} />
      <BrandValuesSection />
      <MidweightSection />
      <NewsletterSection />
    </div>
  );
}
```

**Hero Section (centered text, outlined button):**
```tsx
function HeroSection() {
  return (
    <section className="hero-section">
      <img src="..." alt="The Peak Collection" />
      <div className="hero-content">
        <h1>The Peak<br />Collection</h1>
        <p>Push your performance with our premium athletic wear</p>
        <Link to="/collections" className="hero-button">Shop now</Link>
      </div>
    </section>
  );
}
```

---

### 4. Product Page Features

**Features implemented:**
- Zoom lightbox (click magnifying glass → fullscreen image)
- Image pagination (1/1 with arrows)
- Color swatches (circular)
- Size buttons (rectangular)
- Quantity selector (+/- buttons)
- "Shipping calculated at checkout" link

**Zoom Lightbox:**
```tsx
function ProductImage({image}) {
  const [isZoomed, setIsZoomed] = React.useState(false);

  return (
    <>
      <div className="product-image">
        <button onClick={() => setIsZoomed(true)}>🔍+</button>
        <Image data={image} />
      </div>

      {isZoomed && (
        <div className="product-lightbox" onClick={() => setIsZoomed(false)}>
          <img src={image.url} />
          <button className="close">✕</button>
        </div>
      )}
    </>
  );
}
```

**Color Swatches:**
```tsx
const colorMap = {
  green: '#2d5a27',
  olive: '#808000',
  ocean: '#006994',
  // ... more colors
};

{option.values.map(({value, to, isActive}) => (
  <Link to={to} className={`swatch ${isActive ? 'active' : ''}`}>
    <span style={{backgroundColor: colorMap[value.toLowerCase()]}} />
  </Link>
))}
```

---

### 5. Cart Drawer

**Features:**
- Right-side slide-in drawer
- Line items with images
- Quantity controls per item
- Remove item button
- Subtotal calculation
- Checkout button (links to Shopify checkout)

**CSS-only drawer trigger:**
```css
/* Drawer is hidden by default */
.overlay {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

/* When URL hash matches #cart-aside */
.overlay:target {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.overlay:target aside {
  transform: translateX(0);
}
```

---

### 6. Mobile Menu

**Features:**
- Left-side slide-in (opposite of cart)
- Navigation links
- Login link with icon
- Social media icons

**Implementation:**
```tsx
function MobileMenuAside({menu}) {
  return (
    <Aside id="mobile-menu-aside" position="left">
      <HeaderMenu menu={menu} viewport="mobile" />
      <div className="mobile-menu-footer">
        <a href="/account" className="mobile-menu-login">
          <UserIcon /> Log in
        </a>
        <div className="mobile-menu-social">
          <a href="https://twitter.com">𝕏</a>
          <a href="https://facebook.com">f</a>
          {/* ... */}
        </div>
      </div>
    </Aside>
  );
}
```

---

## GraphQL Queries

### Product Query (with variants)
```graphql
query Product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
  product(handle: $handle) {
    id
    title
    descriptionHtml
    options { name, values }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes { ...ProductVariant }
    }
  }
}

fragment ProductVariant on ProductVariant {
  id
  availableForSale
  price { amount, currencyCode }
  compareAtPrice { amount, currencyCode }
  image { url, altText, width, height }
  selectedOptions { name, value }
}
```

### Deferred Variants Query
```graphql
query ProductVariants($handle: String!) {
  product(handle: $handle) {
    variants(first: 250) {
      nodes { ...ProductVariant }
    }
  }
}
```

This pattern allows:
1. Critical product data loads immediately
2. All variant data streams in (deferred)
3. UI updates progressively

---

## CSS Design Tokens

Extracted from mock.shop/Dawn theme:

```css
:root {
  /* Colors */
  --color-background: #f3f3f3;
  --color-background-alt: #ffffff;
  --color-text: #000000;
  --color-text-muted: #707070;
  --color-border: #e0e0e0;
  --color-accent: #b5651d; /* "New arrivals" orange */

  /* Spacing */
  --header-height: 100px;
  --aside-width: 400px;
  --spacing-desktop: 40px;
  --spacing-mobile: 20px;

  /* Typography */
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Borders */
  --radius-product: 12px;
  --radius-button: 2px;
}
```

---

## Key Learnings

### 1. Hydrogen ≠ Liquid, but equivalent results
Dawn's Liquid templates and Hydrogen's React components achieve the same UI, just with different mental models:
- Liquid: Template-based, server-rendered
- Hydrogen: Component-based, hybrid rendering

### 2. CSS :target is powerful
Using URL hash (`#cart-aside`) + `:target` pseudo-class enables CSS-only drawers without JavaScript state management.

### 3. Deferred data is essential
Products need instant display, but 250 variants can wait. Remix's `defer` + `Await` pattern handles this elegantly.

### 4. Hydrogen components abstract complexity
`<Image>` handles srcset, lazy loading, aspect ratios. `<Money>` handles currency formatting. `<CartForm>` handles optimistic UI.

---

## What's Next

Potential improvements:
- [ ] Product image gallery (multiple images)
- [ ] Collection filters (price, color, size)
- [ ] Wishlist functionality
- [ ] Recently viewed products
- [ ] Product recommendations
- [ ] Analytics integration
- [ ] Performance optimization (Lighthouse 100)

---

*This document serves as a reference for developers transforming Liquid themes to Hydrogen.*
