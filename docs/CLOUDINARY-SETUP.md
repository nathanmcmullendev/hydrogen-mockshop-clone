# Cloudinary Image Optimization Setup

This document explains how Cloudinary CDN integration works in this Hydrogen store.

## Current Status

**Status: Infrastructure Ready, Using Shopify CDN (Fallback)**

The Cloudinary utilities and component are integrated but currently fall back to Shopify's CDN because `import.meta.env` is not available in Vercel's edge runtime at request time.

**Current Behavior:**
- Product grid uses `OptimizedImage` component
- On server (edge), `getCloudinaryCloud()` safely returns `undefined`
- Component falls back to Hydrogen's `<Image>` (Shopify CDN)
- Site works without errors, images load fast

**To fully enable Cloudinary**, the cloud name needs to be passed from the loader via React context (see "Future Improvements" section).

## Overview

The store can use **Cloudinary's Fetch delivery** for image optimization:
- Images are stored on Shopify's CDN (source of truth)
- When `VITE_CLOUDINARY_CLOUD` is configured, images CAN be served through Cloudinary
- Cloudinary fetches from Shopify, applies transforms, and caches at the edge
- Currently, images use Shopify's built-in CDN (which is also fast and well-optimized)

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Browser   │────▶│   Cloudinary     │────▶│   Shopify CDN   │
│             │     │   (Fetch + CDN)  │     │   (Source)      │
└─────────────┘     └──────────────────┘     └─────────────────┘
                           │
                           ▼
                    ┌──────────────────┐
                    │  Transformed &   │
                    │  Cached Image    │
                    └──────────────────┘
```

## Setup

### 1. Get Cloudinary Credentials

1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier available)
2. From your Dashboard, copy your **Cloud Name**

### 2. Configure Environment Variable

**For local development:**
```bash
# .env.local
VITE_CLOUDINARY_CLOUD=your-cloud-name
```

**For Vercel deployment:**
```bash
vercel env add VITE_CLOUDINARY_CLOUD
# Enter: your-cloud-name
# Select: Production, Preview, Development
```

Or via Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add `VITE_CLOUDINARY_CLOUD` with your cloud name

### 3. Rebuild & Deploy

After setting the env var:
```bash
# Local
npm run build && npm run dev

# Vercel
vercel --prod
# Or push to git for automatic deployment
```

## How It Works

### The Key: Vite's import.meta.env

This project uses Vite's built-in environment variable handling:

```typescript
// app/utils/images.ts
export function getCloudinaryCloud(): string | undefined {
  // Vite replaces this at BUILD TIME
  // No hydration issues, works on both server and client
  return import.meta.env.VITE_CLOUDINARY_CLOUD || undefined;
}
```

**Important:** Variables must be prefixed with `VITE_` to be exposed to the client bundle. Vite statically replaces these at build time, so there are no runtime environment variable lookups on the client.

### URL Transformation

When Cloudinary is configured, image URLs are transformed:

**Input (Shopify CDN):**
```
https://cdn.shopify.com/s/files/1/0000/0001/products/hoodie.jpg
```

**Output (Cloudinary Fetch):**
```
https://res.cloudinary.com/YOUR_CLOUD/image/fetch/w_800,q_80,f_auto,c_fill,g_auto/https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0000%2F0001%2Fproducts%2Fhoodie.jpg
```

### Default Transforms

| Parameter | Value | Description |
|-----------|-------|-------------|
| `f_auto` | Auto format | WebP/AVIF if browser supports |
| `q_80` | Quality 80% | Good balance of quality/size |
| `c_fill` | Fill crop | Maintains aspect ratio |
| `g_auto` | Auto gravity | Smart cropping (face detection) |

## Files

### Core Utilities
- `app/utils/images.ts` - Image optimization functions
  - `getCloudinaryCloud()` - Gets cloud name from env
  - `getOptimizedImageUrl()` - Transforms URLs
  - `generateSrcSet()` - Creates responsive srcsets
  - `getLqipUrl()` - Low-quality placeholder URLs

### Component
- `app/components/OptimizedImage.tsx` - React component with:
  - Blur placeholder support
  - Responsive images
  - Fallback to Shopify CDN

## Usage Examples

### Current Approach (Shopify CDN - Recommended)

The store currently uses Hydrogen's built-in `<Image>` component which uses Shopify's CDN:

```tsx
import { Image } from '@shopify/hydrogen';

// Hydrogen's Image component - automatic optimization
<Image
  data={product.featuredImage}
  aspectRatio="1/1"
  sizes="(min-width: 45em) 400px, 100vw"
/>
```

This provides:
- Automatic responsive srcset generation
- WebP/AVIF when browser supports
- Proper aspect ratio handling
- No additional configuration needed

### Manual Cloudinary Usage (Optional)

If you need Cloudinary-specific features (like face detection cropping), you can use the utilities directly:

```tsx
import { getOptimizedImageUrl, generateSrcSet } from '~/utils/images';

// Basic usage - generates Cloudinary URL if configured
const optimizedUrl = getOptimizedImageUrl(product.image.url, {
  width: 800,
  quality: 85,
});

// With srcset for responsive images
const srcSet = generateSrcSet(product.image.url, [320, 640, 960, 1280]);

// Use in a native img tag
<img
  src={optimizedUrl}
  srcSet={srcSet}
  sizes="(min-width: 45em) 400px, 100vw"
  alt={product.title}
/>
```

### OptimizedImage Component (Client-side Only)

The `OptimizedImage` component is available but should be used carefully:

```tsx
import { OptimizedImage } from '~/components/OptimizedImage';

// Works best with direct src (not Shopify data object)
<OptimizedImage
  src="https://cdn.shopify.com/..."
  alt="Product"
  width={600}
  imageOptions={{ quality: 90, format: 'webp' }}
/>
```

**Note:** When passing Shopify image `data`, the component falls back to Hydrogen's Image component to avoid SSR issues.

## Verification

To verify Cloudinary is working:

1. Open browser DevTools → Network tab
2. Filter by "Images"
3. Load a product page
4. Check image URLs - they should be `res.cloudinary.com/...`

If URLs are still `cdn.shopify.com`:
- Check `VITE_CLOUDINARY_CLOUD` is set correctly
- Rebuild the application (env vars are baked in at build time)
- Check browser console for any errors

## Fallback Behavior

If `VITE_CLOUDINARY_CLOUD` is not set or empty:
- Images use Shopify's built-in CDN transforms
- This still provides responsive images and basic optimization
- No code changes required - automatic fallback

## Performance Benefits

| Metric | Without Cloudinary | With Cloudinary |
|--------|-------------------|-----------------|
| Format | JPEG/PNG | Auto (WebP/AVIF) |
| Global CDN | Shopify CDN | Cloudinary Edge |
| Smart Crop | No | Yes (face detection) |
| Placeholder | No | LQIP available |

## Troubleshooting

### Images not using Cloudinary

Currently, the product grid uses Shopify CDN by default. This is intentional.

To verify Cloudinary is configured:
```bash
vercel env ls | grep CLOUDINARY
```

### Known Issue: SSR Compatibility

**Problem:** Using `import.meta.env.VITE_CLOUDINARY_CLOUD` in the OptimizedImage component caused 500 errors when rendering on the server (Vercel Edge/Hydrogen runtime).

**Current Workaround:** The store uses Hydrogen's built-in `<Image>` component which works reliably. Cloudinary utilities are available for manual/client-side use.

**Future Fix Options:**
1. Use Hydrogen's Image `loader` prop to customize URL generation
2. Use React context to pass Cloudinary config from root loader
3. Use client-only wrapper for OptimizedImage component

### Cloudinary returning errors

1. **Check cloud name is correct**
2. **Ensure Fetch delivery is enabled** (default for all accounts)
3. **Check Cloudinary dashboard** for delivery reports

### Hydration errors

If you see React hydration errors related to images:
- The store currently avoids this by using Hydrogen's Image component
- `import.meta.env` can behave differently on server vs client in edge runtimes
- If you need Cloudinary, consider client-only rendering with `useEffect`

## Cost Considerations

Cloudinary's free tier includes:
- 25 credits/month
- ~25,000 transformations
- Sufficient for development and small stores

For production:
- Monitor usage in Cloudinary dashboard
- Consider paid plan for high-traffic stores
- Cloudinary's caching reduces repeated transformations

---

## Quick Reference

```bash
# Set env var locally
echo "VITE_CLOUDINARY_CLOUD=your-cloud-name" >> .env.local

# Set env var on Vercel
vercel env add VITE_CLOUDINARY_CLOUD

# Verify it's set
vercel env ls

# Rebuild and deploy
vercel --prod
```
