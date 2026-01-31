# Hydrogen Vercel Starter

A production-ready Shopify Hydrogen starter optimized for Vercel deployment. Works out of the box with `mock.shop` - no Shopify account needed to try it.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nathanmcmullendev/hydrogen-mockshop-clone&env=SESSION_SECRET,PUBLIC_STORE_DOMAIN&envDescription=Required%20environment%20variables&envLink=https://github.com/nathanmcmullendev/hydrogen-mockshop-clone%23environment-variables&project-name=hydrogen-store&repository-name=hydrogen-store)

**Live Demo:** https://hydrogen-vercel-fresh.vercel.app

---

## Features

- **Metaobjects CMS** - 14 section types for visual page building (free alternative to $49+ templates)
- **Vercel-optimized** - Deploys with zero configuration
- **Full e-commerce** - Collections, products, cart, checkout
- **Search** - Product search with filters
- **Responsive** - Mobile-first design
- **TypeScript** - Full type safety
- **SEO Ready** - Meta tags, sitemap, robots.txt
- **Customer accounts** - Login, register, order history
- **Static fallback** - Works without metaobjects configured

## Quick Start

### Try without Shopify account

```bash
git clone https://github.com/nathanmcmullendev/hydrogen-mockshop-clone.git
cd hydrogen-mockshop-clone
npm install --legacy-peer-deps
npm run dev
```

Uses `mock.shop` by default - no Shopify account needed!

Open http://localhost:3000

### Connect your Shopify store

1. Create a Hydrogen storefront in Shopify Admin
2. Go to Settings > Apps > Develop apps > Create app
3. Configure Storefront API access
4. Copy your credentials to `.env`:

```bash
cp .env.example .env
```

```env
SESSION_SECRET="your-secret-key-min-32-chars"
PUBLIC_STORE_DOMAIN="your-store.myshopify.com"
PUBLIC_STOREFRONT_API_TOKEN="your-storefront-token"
```

---

## Deploy to Vercel

### Option 1: One-Click Deploy

Click the button at the top of this README. You'll need to set:

| Variable | Value |
|----------|-------|
| `SESSION_SECRET` | Any string, min 32 characters |
| `PUBLIC_STORE_DOMAIN` | `mock.shop` or `your-store.myshopify.com` |

### Option 2: CLI Deploy

```bash
npm i -g vercel
vercel
```

Add environment variables in the Vercel dashboard under Project Settings > Environment Variables.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SESSION_SECRET` | Yes | Session encryption key (min 32 chars) |
| `PUBLIC_STORE_DOMAIN` | Yes | `mock.shop` or `your-store.myshopify.com` |
| `PUBLIC_STOREFRONT_API_TOKEN` | For real stores | Storefront API public token |
| `PRIVATE_STOREFRONT_API_TOKEN` | Optional | Storefront API private token |

See `.env.example` for full documentation.

---

## Metaobjects CMS (14 Section Types)

This template includes a free, open-source CMS layer powered by Shopify Metaobjects - matching premium templates like Ciseco ($49).

| Category | Sections |
|----------|----------|
| **Hero** | Hero, Hero Slider |
| **Products** | Featured Products, Collection Grid |
| **Content** | Rich Text, Image With Text, Video |
| **Social Proof** | Testimonials, Logos |
| **Utility** | FAQ, Features, Banner, Countdown, Newsletter |

**How it works:**
- Without metaobjects → renders beautiful static homepage
- With metaobjects → renders CMS-driven content

See [app/sections/README.md](./app/sections/README.md) for full documentation and metaobject definitions.

---

## Project Structure

```
app/
├── components/
│   ├── Aside.tsx       # Drawer component (cart, menu)
│   ├── Cart.tsx        # Cart functionality
│   ├── Footer.tsx      # Site footer
│   ├── Header.tsx      # Site header with navigation
│   ├── Layout.tsx      # Main layout wrapper
│   └── Search.tsx      # Predictive search
├── sections/           # Metaobjects CMS (14 section types)
│   ├── Sections.tsx    # Dynamic section router
│   ├── RouteContent.tsx # Route query component
│   ├── SectionHero.tsx
│   ├── SectionFeaturedProducts.tsx
│   └── ...             # 12 more sections
├── routes/
│   ├── _index.tsx              # Homepage (with CMS support)
│   ├── cart.tsx                # Cart page
│   ├── collections._index.tsx  # All collections
│   ├── collections.$handle.tsx # Collection detail
│   ├── products.$handle.tsx    # Product detail
│   ├── search.tsx              # Search results
│   └── $.tsx                   # 404 page
├── styles/
│   └── app.css         # All styles
├── utils/
│   └── parseSection.ts # Metafield parser utility
└── root.tsx            # App root with providers
```

---

## Pages Included

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, featured products, newsletter |
| `/collections` | All collections grid |
| `/collections/:handle` | Collection with product grid |
| `/products/:handle` | Product page with variants, zoom, add to cart |
| `/search` | Search with filters |
| `/cart` | Cart drawer |
| `/account/*` | Customer account pages |

---

## Tech Stack

- [Hydrogen](https://hydrogen.shopify.dev/) - Shopify's React framework
- [Remix](https://remix.run/) - Full-stack web framework
- [Vercel](https://vercel.com/) - Deployment platform
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

## Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## Why This Starter?

Deploying Hydrogen to Vercel has been a documented pain point for 3+ years. This starter:

- Pre-applies all required Vercel configuration
- Works with `mock.shop` out of the box
- **Free Metaobjects CMS** matching $49-299 premium templates
- No paid CMS or platform lock-in required
- One-click deploy to Vercel

See [MARKET-RESEARCH-VERCEL-DEPLOYMENT.md](./MARKET-RESEARCH-VERCEL-DEPLOYMENT.md) for deployment research and [COMPETITIVE-ANALYSIS.md](./COMPETITIVE-ANALYSIS.md) for template comparison.

---

## Contributing

Issues and PRs welcome. Please test your changes with:

```bash
npm run build
npm run typecheck
npm run lint
```

---

## License

MIT - Use this as a starting point for your own Hydrogen storefronts.
