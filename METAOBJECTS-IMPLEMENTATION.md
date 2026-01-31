# Metaobjects CMS Implementation Guide

> **Purpose:** Transform hydrogen-vercel-fresh into a sellable premium template by adding Shopify Metaobjects as a CMS layer.
> **Reference:** Based on Shopify's official Hydrogen Cookbook recipe

---

## Overview

### What Metaobjects Give You

```
Before (Static):                    After (CMS-Driven):
─────────────────                   ───────────────────
Homepage hardcoded                  Homepage from Metaobjects
  └── Static hero                     └── Route: "route-home"
  └── Static products                     ├── SectionHero
  └── Static collections                  ├── SectionFeaturedProducts
                                          ├── SectionFeaturedCollections
                                          └── SectionTestimonials

Merchant edits code                 Merchant edits Shopify Admin
  └── Needs developer                 └── No code changes needed
```

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Shopify Admin                       │
│  Settings → Custom Data → Metaobjects               │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Route (metaobject)                          │   │
│  │   handle: "route-home"                      │   │
│  │   title: "Homepage"                         │   │
│  │   sections: [reference list]                │   │
│  │     ├── SectionHero (metaobject ref)       │   │
│  │     ├── SectionFeaturedProducts (ref)      │   │
│  │     └── SectionFeaturedCollections (ref)   │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        │
                        ▼ GraphQL Query
┌─────────────────────────────────────────────────────┐
│                 Hydrogen Frontend                    │
│                                                     │
│  app/routes/_index.tsx                              │
│    └── loader() → ROUTE_CONTENT_QUERY              │
│    └── Homepage() → <RouteContent route={route} /> │
│                                                     │
│  app/sections/RouteContent.tsx                      │
│    └── Queries route metaobject by handle          │
│    └── Renders <Sections sections={route.sections}/>│
│                                                     │
│  app/sections/Sections.tsx                          │
│    └── switch(section.type)                        │
│        case 'section_hero': <SectionHero />        │
│        case 'section_featured_products': ...       │
└─────────────────────────────────────────────────────┘
```

---

## Implementation Steps

### Phase 1: Core Infrastructure (4 files)

#### 1.1 Create `app/utils/parseSection.ts`

This utility parses metaobject fields into usable React props:

```typescript
import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseMetafield} from '@shopify/hydrogen';

/**
 * Recursively parse metafields (objects containing a type, value and key)
 * into a more usable format. Removes nested reference and references keys.
 */
export function parseSection<InputType, ReturnType>(_section: InputType) {
  const section = liftEach(_section, [
    'reference',
    'references',
  ] as const);
  const parsed = {} as Record<string, unknown>;

  for (const key in section) {
    const node = section[key];
    if (typeof node === 'object') {
      // @ts-expect-error node might not have type and value properties
      const isMetafield = node?.type && node?.value;
      const isArray = Array.isArray(node);
      if (isArray) {
        parsed[key] = (node as unknown[]).map((item) => parseSection(item));
      } else if (isMetafield) {
        parsed[key] = parseMetafieldValue(node);
      } else if (node && Object.keys(node as object).length > 0) {
        parsed[key] = parseSection(node as unknown);
      } else {
        delete parsed[key];
      }
    } else {
      parsed[key] = node;
    }
  }
  return parsed as unknown as typeof section & ReturnType;
}

function parseMetafieldValue(node: Record<string, any>) {
  switch (node?.type) {
    case 'single_line_text_field':
      return parseMetafield<ParsedMetafields['single_line_text_field']>(node);
    case 'multi_line_text_field':
      return parseMetafield<ParsedMetafields['multi_line_text_field']>(node);
    case 'list.single_line_text_field':
      return parseMetafield<ParsedMetafields['list.single_line_text_field']>(node);
    case 'list.collection_reference':
      return parseMetafield<ParsedMetafields['list.collection_reference']>(node);
    default:
      return node;
  }
}

// Type utilities for lifting nested keys
type LiftOtherKeys<KeyToLift, Section> = KeyToLift extends keyof Section
  ? Lift<Section[KeyToLift], KeyToLift>
  : object;

type Lift<Section, KeyToLift> = Section extends object
  ? Section extends Array<infer Item>
    ? Lift<Item, KeyToLift>[]
    : {
        [P in Exclude<keyof Section, KeyToLift>]: P extends 'value'
          ? NonNullable<Lift<Section[P], KeyToLift>> | undefined
          : Lift<Section[P], KeyToLift>;
      } & LiftOtherKeys<KeyToLift, Section>
  : Section;

type LiftEach<Section, KeysToLift> = KeysToLift extends readonly [
  infer FirstKeyToLift,
  ...infer RemainingKeysToLift,
]
  ? LiftEach<Lift<Section, FirstKeyToLift>, RemainingKeysToLift>
  : Section;

function lift<Section, KeyToRemove extends PropertyKey>(
  value: Section,
  key: KeyToRemove,
): Lift<Section, KeyToRemove> {
  const isArray = Array.isArray(value);

  function liftObject(value: any) {
    const entries = Object.entries(value)
      .filter(([prop]) => prop !== key)
      .map(([prop, val]) => {
        const liftedVal = lift(val, key);
        return [prop, liftedVal];
      });
    const target = Object.fromEntries(entries);
    const source = key in value ? lift((value as any)[key], key) : {};
    const lifted = Array.isArray(source)
      ? source
      : Object.assign(target, source);
    return lifted;
  }

  return (
    value && typeof value === 'object'
      ? isArray
        ? value.map((item) => liftObject(item))
        : liftObject(value)
      : value
  ) as Lift<Section, KeyToRemove>;
}

function liftEach<Section, KeysToRemove extends ReadonlyArray<PropertyKey>>(
  obj: Section,
  keys: KeysToRemove,
): LiftEach<Section, KeysToRemove> {
  return keys.reduce<object | Section>((result, keyToLift) => {
    return lift(result, keyToLift);
  }, obj) as LiftEach<Section, KeysToRemove>;
}
```

#### 1.2 Create `app/sections/Sections.tsx`

The section router that maps metaobject types to React components:

```typescript
import {SECTION_HERO_FRAGMENT, SectionHero} from '~/sections/SectionHero';
import {
  SECTION_FEATURED_PRODUCTS_FRAGMENT,
  SectionFeaturedProducts,
} from '~/sections/SectionFeaturedProducts';
import {
  SECTION_FEATURED_COLLECTIONS_FRAGMENT,
  SectionFeaturedCollections,
} from '~/sections/SectionFeaturedCollections';
// Add more section imports as you create them

import type {SectionsFragment} from 'storefrontapi.generated';

export function Sections({sections}: {sections: SectionsFragment}) {
  return (
    <div className="sections">
      {sections?.references?.nodes.map((section) => {
        switch (section.type) {
          case 'section_hero':
            return <SectionHero {...section} key={section.id} />;
          case 'section_featured_products':
            return <SectionFeaturedProducts {...section} key={section.id} />;
          case 'section_featured_collections':
            return <SectionFeaturedCollections {...section} key={section.id} />;
          // Add more cases as you create sections
          default:
            console.log(`Unsupported section type: ${section.type}`);
            return null;
        }
      })}
    </div>
  );
}

export const SECTIONS_FRAGMENT = `#graphql
  fragment Sections on MetaobjectField {
    ... on MetaobjectField {
      references(first: 10) {
        nodes {
          ... on Metaobject {
            id
            type
            ...SectionHero
            ...SectionFeaturedProducts
            ...SectionFeaturedCollections
          }
        }
      }
    }
  }
  ${SECTION_HERO_FRAGMENT}
  ${SECTION_FEATURED_PRODUCTS_FRAGMENT}
  ${SECTION_FEATURED_COLLECTIONS_FRAGMENT}
`;
```

#### 1.3 Create `app/sections/RouteContent.tsx`

The main query and renderer for route-based content:

```typescript
import {SECTIONS_FRAGMENT, Sections} from '~/sections/Sections';
import type {RouteContentQuery} from 'storefrontapi.generated';

export function RouteContent({route}: {route: RouteContentQuery['route']}) {
  if (!route?.sections) {
    return <p>No content sections configured for this page.</p>;
  }

  return (
    <div className="route-content">
      {route?.sections && <Sections sections={route.sections} />}
    </div>
  );
}

export const ROUTE_CONTENT_QUERY = `#graphql
  query RouteContent($handle: String!) {
    route: metaobject(handle: {type: "route", handle: $handle}) {
      type
      id
      title: field(key: "title") {
        key
        value
      }
      sections: field(key: "sections") {
        ...Sections
      }
    }
  }
  ${SECTIONS_FRAGMENT}
`;
```

---

### Phase 2: Section Components

#### 2.1 Create `app/sections/SectionHero.tsx`

```typescript
import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';
import {Link} from '@remix-run/react';
import type {SectionHeroFragment} from 'storefrontapi.generated';

export function SectionHero(props: SectionHeroFragment) {
  const section = parseSection<
    SectionHeroFragment,
    {
      heading?: ParsedMetafields['single_line_text_field'];
      subheading?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {image, heading, subheading, link} = section;

  const backgroundImage = image?.image?.url
    ? `url("${image.image.url}")`
    : undefined;

  return (
    <section
      className="section-hero"
      style={{
        backgroundImage,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        position: 'relative',
        minHeight: '500px',
      }}
    >
      <div className="section-hero__content">
        {heading && <h1>{heading.parsedValue}</h1>}
        {subheading && <p>{subheading.value}</p>}
        {link?.href?.value && (
          <Link to={link.href.value} className="section-hero__cta">
            {link?.text?.value}
          </Link>
        )}
      </div>
    </section>
  );
}

const MEDIA_IMAGE_FRAGMENT = `#graphql
  fragment MediaImage on MediaImage {
    image {
      altText
      url
      width
      height
    }
  }
`;

const LINK_FRAGMENT = `#graphql
  fragment Link on MetaobjectField {
    ... on MetaobjectField {
      reference {
        ...on Metaobject {
          href: field(key: "href") { value }
          target: field(key: "target") { value }
          text: field(key: "text") { value }
        }
      }
    }
  }
`;

export const SECTION_HERO_FRAGMENT = `#graphql
  fragment SectionHero on Metaobject {
    type
    heading: field(key: "heading") {
      key
      value
    }
    subheading: field(key: "subheading") {
      key
      value
    }
    link: field(key: "link") {
      ...Link
    }
    image: field(key: "image") {
      key
      reference {
        ... on MediaImage {
          ...MediaImage
        }
      }
    }
  }
  ${LINK_FRAGMENT}
  ${MEDIA_IMAGE_FRAGMENT}
`;
```

#### 2.2 Create `app/sections/SectionFeaturedProducts.tsx`

```typescript
import {Money, Image} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import type {SectionFeaturedProductsFragment} from 'storefrontapi.generated';

export function SectionFeaturedProducts(props: SectionFeaturedProductsFragment) {
  const {heading, body, products, withProductPrices} = props;

  return (
    <section className="section-featured-products">
      {heading && <h2>{heading.value}</h2>}
      {body && <p className="section-description">{body.value}</p>}
      {products?.references?.nodes && (
        <div className="products-grid">
          {products.references.nodes.map((product) => {
            const {variants, priceRange, title} = product;
            const variant = variants?.nodes?.[0];
            return (
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                className="product-card"
                prefetch="intent"
              >
                {variant?.image && (
                  <Image data={variant.image} aspectRatio="1/1" />
                )}
                <h5>{title}</h5>
                {withProductPrices?.value === 'true' && (
                  <Money data={priceRange.minVariantPrice} />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

const FEATURED_PRODUCT_FRAGMENT = `#graphql
  fragment FeaturedProduct on Product {
    id
    title
    handle
    variants(first: 1) {
      nodes {
        image {
          altText
          width
          height
          url
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

export const SECTION_FEATURED_PRODUCTS_FRAGMENT = `#graphql
  fragment SectionFeaturedProducts on Metaobject {
    type
    heading: field(key: "heading") {
      key
      value
    }
    body: field(key: "body") {
      key
      value
    }
    products: field(key: "products") {
      references(first: 10) {
        nodes {
          ... on Product {
            ...FeaturedProduct
          }
        }
      }
    }
    withProductPrices: field(key: "with_product_prices") {
      key
      value
    }
  }
  ${FEATURED_PRODUCT_FRAGMENT}
`;
```

#### 2.3 Create `app/sections/SectionFeaturedCollections.tsx`

```typescript
import {Image} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import type {SectionFeaturedCollectionsFragment} from 'storefrontapi.generated';
import {parseSection} from '~/utils/parseSection';
import type {ParsedMetafields} from '@shopify/hydrogen';

export function SectionFeaturedCollections(props: SectionFeaturedCollectionsFragment) {
  const section = parseSection<
    SectionFeaturedCollectionsFragment,
    {
      heading?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {heading, collections} = section;

  return (
    <section className="section-featured-collections">
      {heading && <h2>{heading.parsedValue}</h2>}
      {collections?.nodes && (
        <div className="collections-grid">
          {collections.nodes.map((collection) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.handle}`}
              className="collection-card"
            >
              {collection.image && (
                <Image data={collection.image} aspectRatio="1/1" />
              )}
              <h5>{collection.title}</h5>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export const SECTION_FEATURED_COLLECTIONS_FRAGMENT = `#graphql
  fragment SectionFeaturedCollections on Metaobject {
    type
    id
    heading: field(key: "heading") {
      type
      key
      value
    }
    collections: field(key: "collections") {
      references(first: 10) {
        nodes {
          ... on Collection {
            id
            title
            handle
            image {
              altText
              width
              height
              url
            }
          }
        }
      }
    }
  }
`;
```

---

### Phase 3: Update Routes to Use Metaobjects

#### 3.1 Update `app/routes/_index.tsx`

```typescript
import {useLoaderData} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {ROUTE_CONTENT_QUERY, RouteContent} from '~/sections/RouteContent';

export const meta = () => {
  return [{title: 'Home | Your Store'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  const {route} = await storefront.query(ROUTE_CONTENT_QUERY, {
    variables: {handle: 'route-home'},
  });

  return {route};
}

export default function Homepage() {
  const {route} = useLoaderData<typeof loader>();

  return (
    <div className="home">
      <RouteContent route={route} />
    </div>
  );
}
```

---

### Phase 4: Shopify Admin Setup

#### 4.1 Create Metaobject Definitions

In Shopify Admin → Settings → Custom data → Metaobjects:

**1. Link (helper metaobject)**
```
Type: link
Fields:
  - href (Single line text) - URL
  - text (Single line text) - Link text
  - target (Single line text) - "_blank" or "_self"
```

**2. SectionHero**
```
Type: section_hero
Fields:
  - heading (Single line text)
  - subheading (Single line text)
  - image (File - Images only)
  - link (Metaobject reference → Link)
```

**3. SectionFeaturedProducts**
```
Type: section_featured_products
Fields:
  - heading (Single line text)
  - body (Multi-line text)
  - products (Product reference - List)
  - with_product_prices (True/false)
```

**4. SectionFeaturedCollections**
```
Type: section_featured_collections
Fields:
  - heading (Single line text)
  - collections (Collection reference - List)
```

**5. Route (the page container)**
```
Type: route
Fields:
  - title (Single line text)
  - sections (Metaobject reference - List)
    → Allow: section_hero, section_featured_products, section_featured_collections
```

#### 4.2 Create Content Entries

1. Create section entries (Hero, Featured Products, etc.)
2. Create a Route entry with handle `route-home`
3. Link sections to the route

---

## Additional Sections to Match Ciseco

To compete with Ciseco's 15+ section types, add these:

### Recommended Sections

| Section Type | Purpose | Ciseco Has |
|--------------|---------|------------|
| `section_hero_slider` | Multiple hero slides | Yes |
| `section_testimonials` | Customer reviews | Yes (ClientsSay) |
| `section_image_with_text` | Side-by-side content | Yes |
| `section_steps` | Process/how-it-works | Yes |
| `section_products_slider` | Carousel of products | Yes |
| `section_collections_slider` | Carousel of collections | Yes |
| `section_rich_text` | WYSIWYG content | Yes |
| `section_newsletter` | Email signup | Common |
| `section_instagram_feed` | Social proof | Common |
| `section_brands_logo` | Trust badges | Common |

### Section Template (Copy for New Sections)

```typescript
// app/sections/SectionNewType.tsx
import type {SectionNewTypeFragment} from 'storefrontapi.generated';
import {parseSection} from '~/utils/parseSection';
import type {ParsedMetafields} from '@shopify/hydrogen';

export function SectionNewType(props: SectionNewTypeFragment) {
  const section = parseSection<
    SectionNewTypeFragment,
    {
      // Define parsed field types
    }
  >(props);

  return (
    <section className="section-new-type">
      {/* Render content */}
    </section>
  );
}

export const SECTION_NEW_TYPE_FRAGMENT = `#graphql
  fragment SectionNewType on Metaobject {
    type
    # Add fields matching your metaobject definition
  }
`;
```

Then add to `Sections.tsx`:
1. Import the component and fragment
2. Add case to switch statement
3. Add fragment to SECTIONS_FRAGMENT

---

## Demo Import Script (For Buyers)

Create `scripts/import-demo.ts` for one-click demo setup:

```typescript
// This would use Shopify Admin API to create:
// 1. Metaobject definitions
// 2. Sample section entries
// 3. Route entries linking sections

// Requires: SHOPIFY_ADMIN_API_TOKEN in .env
```

This is what makes Ciseco's "one-click demo import" possible.

---

## File Structure After Implementation

```
app/
├── routes/
│   └── _index.tsx              # Updated to use RouteContent
├── sections/
│   ├── RouteContent.tsx        # Main query + renderer
│   ├── Sections.tsx            # Section router
│   ├── SectionHero.tsx
│   ├── SectionFeaturedProducts.tsx
│   ├── SectionFeaturedCollections.tsx
│   ├── SectionTestimonials.tsx
│   ├── SectionImageWithText.tsx
│   └── ... (more sections)
└── utils/
    └── parseSection.ts         # Metafield parser
```

---

## Effort Estimate

| Task | Complexity | Files |
|------|------------|-------|
| Core infrastructure | Medium | 3 |
| Hero section | Low | 1 |
| Featured Products | Low | 1 |
| Featured Collections | Low | 1 |
| 5 more sections | Medium | 5 |
| Route updates | Low | 1-3 |
| Shopify Admin setup | Manual | N/A |
| Demo import script | Medium | 1 |
| Documentation | Medium | 1 |
| **Total** | **~20-30 hours** | **~15 files** |

---

## Next Steps

1. **Start with core infrastructure** (Phase 1)
2. **Add 3 basic sections** (Hero, Products, Collections)
3. **Test with real Shopify store** (not mock.shop)
4. **Add remaining sections** to match Ciseco
5. **Create demo import script**
6. **Write buyer documentation**

---

*This implementation makes hydrogen-vercel-fresh a sellable premium template.*
