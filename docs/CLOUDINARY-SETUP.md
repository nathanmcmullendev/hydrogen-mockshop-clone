# Cloudinary Image Optimization Setup

This document explains how Cloudinary CDN integration works in this Hydrogen store.

## Overview

The store uses **Cloudinary's Fetch delivery** for image optimization. This means:
- Images are stored on Shopify's CDN (source of truth)
- When `VITE_CLOUDINARY_CLOUD` is configured, images are served through Cloudinary
- Cloudinary fetches from Shopify, applies transforms, and caches at the edge
- If Cloudinary is not configured, images fall back to Shopify's built-in CDN transforms

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

### Using the Utility Function

```tsx
import { getOptimizedImageUrl, generateSrcSet } from '~/utils/images';

// Basic usage
const optimizedUrl = getOptimizedImageUrl(product.image.url, {
  width: 800,
  quality: 85,
});

// With srcset for responsive images
const srcSet = generateSrcSet(product.image.url, [320, 640, 960, 1280]);
```

### Using the Component

```tsx
import { OptimizedImage } from '~/components/OptimizedImage';

// With Shopify image data
<OptimizedImage
  data={product.featuredImage}
  width={400}
  aspectRatio="1/1"
  showPlaceholder={true}
/>

// With direct URL
<OptimizedImage
  src="https://cdn.shopify.com/..."
  alt="Product"
  width={600}
  imageOptions={{ quality: 90, format: 'webp' }}
/>
```

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

1. **Check env var is set:**
   ```bash
   vercel env ls | grep CLOUDINARY
   ```

2. **Rebuild after setting env var:**
   Vite inlines env vars at build time. A new build is required.

3. **Check for typos:**
   The var must be exactly `VITE_CLOUDINARY_CLOUD`

### Cloudinary returning errors

1. **Check cloud name is correct**
2. **Ensure Fetch delivery is enabled** (default for all accounts)
3. **Check Cloudinary dashboard** for delivery reports

### Hydration errors

If you see React hydration errors related to images:
- This implementation uses `import.meta.env` (build-time)
- NOT `window.ENV` (runtime) which causes hydration mismatches
- If you modified the code, ensure you're using `import.meta.env`

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
