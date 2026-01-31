# Sections - Metaobjects CMS System

A free, open-source CMS layer for Shopify Hydrogen powered by Metaobjects.

**14 section types included** - matching premium templates like Ciseco.

## Quick Start

### Without Metaobjects (Works Out of the Box)

The homepage renders a beautiful static design with mock.shop data. No configuration needed.

### With Metaobjects (CMS Mode)

1. Create metaobject definitions in Shopify Admin
2. Create a `route` metaobject with handle `route-home`
3. Add section references to the route
4. Homepage automatically switches to CMS-driven content

---

## Available Sections (14)

### Hero Sections

| Type | Component | Use Case |
|------|-----------|----------|
| `section_hero` | SectionHero | Single hero with image, text, CTA |
| `section_hero_slider` | SectionHeroSlider | Multiple rotating hero slides |

### Product & Collection Sections

| Type | Component | Use Case |
|------|-----------|----------|
| `section_featured_products` | SectionFeaturedProducts | Curated product grid |
| `section_collection_grid` | SectionCollectionGrid | Collection cards grid |

### Content Sections

| Type | Component | Use Case |
|------|-----------|----------|
| `section_rich_text` | SectionRichText | Brand messaging, about content |
| `section_image_with_text` | SectionImageWithText | Image + text side-by-side |
| `section_video` | SectionVideo | YouTube, Vimeo, or direct video |

### Social Proof Sections

| Type | Component | Use Case |
|------|-----------|----------|
| `section_testimonials` | SectionTestimonials | Customer reviews/quotes |
| `section_logos` | SectionLogos | Partner/brand trust badges |

### Utility Sections

| Type | Component | Use Case |
|------|-----------|----------|
| `section_faq` | SectionFAQ | Accordion FAQ |
| `section_features` | SectionFeatures | Feature highlights with icons |
| `section_banner` | SectionBanner | Promotional banner strip |
| `section_countdown` | SectionCountdown | Sale countdown timer |
| `section_newsletter` | SectionNewsletter | Email signup + social links |

---

## Metaobject Definitions

### Core: Route

```
Type: route
Fields:
  - title (Single line text)
  - sections (Metaobject reference - List)
```

Handle convention: `route-{page}` (e.g., `route-home`, `route-about`)

### Section: Hero

```
Type: section_hero
Fields:
  - heading (Single line text)
  - subheading (Single line text)
  - image (File - Images)
  - button_text (Single line text)
  - button_link (Single line text)
```

### Section: Hero Slider

```
Type: section_hero_slider
Fields:
  - slides (Metaobject reference - List) → hero_slide
  - autoplay (True/false)
  - autoplay_speed (Number integer) - milliseconds

Type: hero_slide
Fields:
  - heading (Single line text)
  - subheading (Single line text)
  - image (File - Images)
  - button_text (Single line text)
  - button_link (Single line text)
```

### Section: Featured Products

```
Type: section_featured_products
Fields:
  - label (Single line text) - e.g., "New arrivals"
  - heading (Single line text) - e.g., "Spring '23"
  - products (Product reference - List)
  - show_prices (True/false)
```

### Section: Collection Grid

```
Type: section_collection_grid
Fields:
  - heading (Single line text)
  - subheading (Single line text)
  - collections (Collection reference - List)
  - columns (Number integer) - 2, 3, or 4
```

### Section: Rich Text

```
Type: section_rich_text
Fields:
  - content (Multi-line text)
  - link_text (Single line text)
  - link_url (Single line text)
```

### Section: Image With Text

```
Type: section_image_with_text
Fields:
  - heading (Single line text)
  - body (Multi-line text)
  - image (File - Images)
  - button_text (Single line text)
  - button_link (Single line text)
  - image_position (Single line text) - "left" or "right"
```

### Section: Video

```
Type: section_video
Fields:
  - heading (Single line text)
  - subheading (Single line text)
  - video_url (Single line text) - YouTube/Vimeo URL
  - video_file (File - Videos) - Direct upload
  - poster_image (File - Images)
  - autoplay (True/false)
  - loop (True/false)
  - muted (True/false)
```

### Section: Testimonials

```
Type: section_testimonials
Fields:
  - heading (Single line text)
  - testimonials (Metaobject reference - List) → testimonial

Type: testimonial
Fields:
  - quote (Multi-line text)
  - author (Single line text)
  - role (Single line text)
  - rating (Number integer) - 1-5
  - avatar (File - Images)
```

### Section: Logos

```
Type: section_logos
Fields:
  - heading (Single line text)
  - logos (File - Images - List)
  - grayscale (True/false)
```

### Section: FAQ

```
Type: section_faq
Fields:
  - heading (Single line text)
  - subheading (Single line text)
  - faqs (Metaobject reference - List) → faq_item

Type: faq_item
Fields:
  - question (Single line text)
  - answer (Multi-line text)
```

### Section: Features

```
Type: section_features
Fields:
  - heading (Single line text)
  - subheading (Single line text)
  - features (Metaobject reference - List) → feature_item
  - columns (Number integer) - 2, 3, or 4

Type: feature_item
Fields:
  - title (Single line text)
  - description (Multi-line text)
  - icon (Single line text) - truck, shield, refresh, clock, star, heart, check, gift
  - icon_image (File - Images) - Custom icon
```

### Section: Banner

```
Type: section_banner
Fields:
  - text (Single line text)
  - link_text (Single line text)
  - link_url (Single line text)
  - background_color (Single line text) - hex, e.g., "#000000"
  - text_color (Single line text) - hex, e.g., "#ffffff"
```

### Section: Countdown

```
Type: section_countdown
Fields:
  - heading (Single line text)
  - subheading (Single line text)
  - end_date (Date and time)
  - expired_text (Single line text)
  - button_text (Single line text)
  - button_link (Single line text)
  - background_color (Single line text)
  - text_color (Single line text)
```

### Section: Newsletter

```
Type: section_newsletter
Fields:
  - heading (Single line text)
  - placeholder (Single line text)
  - social_text (Single line text)
  - twitter_url (Single line text)
  - instagram_url (Single line text)
  - facebook_url (Single line text)
  - youtube_url (Single line text)
  - pinterest_url (Single line text)
  - tiktok_url (Single line text)
```

---

## Adding a New Section

1. Create `app/sections/SectionNewType.tsx`:

```tsx
import {parseSection} from '~/utils/parseSection';

export function SectionNewType(props: SectionNewTypeFragment) {
  const section = parseSection(props);
  return <section className="section-new-type">{/* JSX */}</section>;
}

export interface SectionNewTypeFragment {
  type: string;
  id?: string;
  // Add field types
}

export const SECTION_NEW_TYPE_FRAGMENT = `#graphql
  fragment SectionNewType on Metaobject {
    type
    id
    # Add field queries
  }
`;
```

2. Register in `Sections.tsx`:

```tsx
// Import
import {SECTION_NEW_TYPE_FRAGMENT, SectionNewType} from './SectionNewType';

// Add to switch
case 'section_new_type':
  return <SectionNewType {...section} key={section.id} />;

// Add to SECTIONS_FRAGMENT
...SectionNewType
${SECTION_NEW_TYPE_FRAGMENT}
```

3. Export from `index.ts`

4. Create metaobject definition in Shopify Admin

---

## File Structure

```
app/sections/
├── index.ts                    # Exports
├── README.md                   # This file
├── RouteContent.tsx            # Query + render
├── Sections.tsx                # Router (switch)
│
├── SectionHero.tsx             # Hero sections
├── SectionHeroSlider.tsx
│
├── SectionFeaturedProducts.tsx # Product sections
├── SectionCollectionGrid.tsx
│
├── SectionRichText.tsx         # Content sections
├── SectionImageWithText.tsx
├── SectionVideo.tsx
│
├── SectionTestimonials.tsx     # Social proof
├── SectionLogos.tsx
│
├── SectionFAQ.tsx              # Utility sections
├── SectionFeatures.tsx
├── SectionBanner.tsx
├── SectionCountdown.tsx
└── SectionNewsletter.tsx

app/utils/
└── parseSection.ts             # Metafield parser
```

---

## Usage in Routes

```tsx
import {RouteContent, ROUTE_CONTENT_QUERY, hasRouteContent} from '~/sections';

export async function loader({context}: LoaderArgs) {
  const {route} = await context.storefront.query(ROUTE_CONTENT_QUERY, {
    variables: {handle: 'route-about'},
  });
  return {route};
}

export default function AboutPage() {
  const {route} = useLoaderData();

  if (!hasRouteContent(route)) {
    return <StaticFallback />;
  }

  return <RouteContent route={route} />;
}
```

---

## Comparison to Ciseco ($49)

| Feature | Ciseco | This Template |
|---------|--------|---------------|
| **Price** | $49 | Free |
| **Section Types** | 15 | 14 |
| **Metaobjects CMS** | Yes | Yes |
| **TypeScript** | Yes | Yes |
| **Static Fallback** | No | Yes |
| **Vercel Deploy** | No | Yes |
| **Open Source** | No | Yes |

---

## License

MIT - Free to use, modify, and distribute.

Built for the Hydrogen community.
