# Mock.shop Hydrogen Clone

> **The first complete Hydrogen-based replica of Shopify's official demo store (demostore.mock.shop)**

This project demonstrates how to transform a standard Hydrogen template into a production-quality storefront that perfectly aligns with Shopify's Hydrogen protocols, component architecture, and best practices.

**Live Demo:** https://hydrogen-vercel-fresh.vercel.app
**Reference:** https://demostore.mock.shop

---

## Why This Matters

Shopify's `demostore.mock.shop` is built with the Dawn theme (Liquid). This project proves you can achieve **pixel-perfect parity** using Hydrogen (React/Remix) while following all official patterns:

- **Hydrogen Components**: `<Image>`, `<Money>`, `<CartForm>`, `VariantSelector`
- **Remix Patterns**: `loader`, `defer`, `Await`, `Suspense`
- **Storefront API**: GraphQL queries with proper fragments
- **Vercel Deployment**: Zero-config deployment with environment variables

---

## What's Included

### Pages
| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, new arrivals, brand values, midweight section, newsletter |
| `/collections` | All collections grid |
| `/collections/:handle` | Collection detail with product grid |
| `/products/:handle` | Product detail with variants, zoom lightbox, add to cart |
| `/search` | Search results page with filters |
| `/cart` | Cart aside drawer |
| `/account/*` | Account pages (login, orders, addresses) |

### Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `Layout` | `app/components/Layout.tsx` | Main layout with header, cart aside, search dropdown, mobile menu |
| `Header` | `app/components/Header.tsx` | Navigation with Liquid logo, search, cart icons |
| `Footer` | `app/components/Footer.tsx` | Newsletter, social links, locale selectors |
| `Aside` | `app/components/Aside.tsx` | Reusable drawer (left/right positioning) |
| `Cart` | `app/components/Cart.tsx` | Cart functionality with quantity controls |
| `Search` | `app/components/Search.tsx` | Predictive search with results |

### Key Features Implemented
- [x] **Search Dropdown** - Top dropdown with bordered input, floating label (matches Dawn theme)
- [x] **Product Zoom** - Working lightbox modal when clicking zoom icon
- [x] **Variant Selector** - Color swatches + size buttons with URL-based state
- [x] **Quantity Selector** - Increment/decrement with cart integration
- [x] **Cart Drawer** - Slide-in cart with line items and checkout
- [x] **Mobile Menu** - Left-sliding menu with navigation and social links
- [x] **Responsive Design** - Mobile-first CSS matching mock.shop breakpoints

---

## Architecture

```
hydrogen-vercel-fresh/
├── app/
│   ├── components/
│   │   ├── Layout.tsx      # Main layout wrapper
│   │   ├── Header.tsx      # Site header with navigation
│   │   ├── Footer.tsx      # Site footer
│   │   ├── Aside.tsx       # Drawer component (cart, menu)
│   │   ├── Cart.tsx        # Cart functionality
│   │   └── Search.tsx      # Predictive search
│   ├── routes/
│   │   ├── _index.tsx      # Homepage
│   │   ├── collections._index.tsx
│   │   ├── collections.$handle.tsx
│   │   ├── products.$handle.tsx
│   │   ├── search.tsx
│   │   ├── cart.tsx
│   │   └── account.*.tsx   # Account routes
│   ├── styles/
│   │   └── app.css         # All styles (no Tailwind)
│   └── root.tsx            # App root with providers
├── public/
├── storefrontapi.generated.d.ts  # Generated types
└── vercel.json             # Vercel config with env vars
```

### Data Flow

```
User Request
     ↓
Remix Loader (server)
     ↓
Storefront API Query (GraphQL)
     ↓
Deferred Data (streaming)
     ↓
React Components (client)
     ↓
Hydrogen Components render
```

---

## Hydrogen Patterns Used

### 1. Deferred Loading
```tsx
// In loader
export async function loader({context}: LoaderArgs) {
  const criticalData = await storefront.query(CRITICAL_QUERY);
  const deferredData = storefront.query(DEFERRED_QUERY); // No await
  return defer({criticalData, deferredData});
}

// In component
<Suspense fallback={<Loading />}>
  <Await resolve={deferredData}>
    {(data) => <Component data={data} />}
  </Await>
</Suspense>
```

### 2. Cart Form Actions
```tsx
<CartForm
  route="/cart"
  inputs={{lines}}
  action={CartForm.ACTIONS.LinesAdd}
>
  {(fetcher) => (
    <button type="submit" disabled={fetcher.state !== 'idle'}>
      Add to cart
    </button>
  )}
</CartForm>
```

### 3. Variant Selector with URL State
```tsx
<VariantSelector
  handle={product.handle}
  options={product.options}
  variants={variants}
>
  {({option}) => (
    <Link to={option.to} preventScrollReset replace>
      {option.value}
    </Link>
  )}
</VariantSelector>
```

### 4. Image Component with Optimization
```tsx
<Image
  data={image}
  aspectRatio="1/1"
  sizes="(min-width: 45em) 50vw, 100vw"
/>
```

---

## CSS Architecture

All styles in `app/styles/app.css` follow mock.shop's design system:

```css
:root {
  --color-background: #f3f3f3;
  --color-background-alt: #ffffff;
  --color-text: #000000;
  --color-text-muted: #707070;
  --color-border: #e0e0e0;
  --header-height: 100px;
  --aside-width: 400px;
  --radius-product: 12px;
}
```

### Key CSS Patterns
- **CSS-only drawers**: Using `:target` pseudo-class for cart/menu
- **Floating labels**: Using `:placeholder-shown` for search input
- **Grid layouts**: CSS Grid for header (3-column) and product grids
- **Aspect ratios**: Native `aspect-ratio` for consistent image sizing

---

## Environment Variables

```env
SESSION_SECRET=your-secret-key
PUBLIC_STOREFRONT_API_TOKEN=your-storefront-token
PUBLIC_STORE_DOMAIN=mock.shop
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod
```

---

## Differences from Dawn Theme

| Aspect | Dawn (Liquid) | This Project (Hydrogen) |
|--------|---------------|-------------------------|
| Framework | Shopify Liquid | Remix + React |
| Data Fetching | Liquid objects | GraphQL + Storefront API |
| Styling | CSS + Liquid | Pure CSS |
| Cart | AJAX + Liquid | CartForm + Remix actions |
| Search | Predictive Search API | Same API, React components |
| Deployment | Shopify hosting | Vercel (or any Node host) |

---

## Credits

- **Shopify** - Hydrogen framework, Storefront API, mock.shop demo
- **Vercel** - Hosting and deployment
- **Dawn Theme** - Design reference (open source)

---

## License

MIT - Use this as a starting point for your own Hydrogen storefronts.
