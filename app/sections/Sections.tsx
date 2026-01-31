/**
 * Dynamic Section Renderer
 *
 * This component maps Shopify Metaobject types to React components.
 * When you create a new section component, add it here.
 *
 * The pattern:
 * 1. Metaobject type in Shopify Admin (e.g., "section_hero")
 * 2. React component (e.g., SectionHero)
 * 3. GraphQL fragment (e.g., SECTION_HERO_FRAGMENT)
 * 4. Case in switch statement below
 */

// Core sections
import {
  SECTION_HERO_FRAGMENT,
  SectionHero,
  type SectionHeroFragment,
} from '~/sections/SectionHero';
import {
  SECTION_HERO_SLIDER_FRAGMENT,
  SectionHeroSlider,
  type SectionHeroSliderFragment,
} from '~/sections/SectionHeroSlider';
import {
  SECTION_FEATURED_PRODUCTS_FRAGMENT,
  SectionFeaturedProducts,
  type SectionFeaturedProductsFragment,
} from '~/sections/SectionFeaturedProducts';
import {
  SECTION_COLLECTION_GRID_FRAGMENT,
  SectionCollectionGrid,
  type SectionCollectionGridFragment,
} from '~/sections/SectionCollectionGrid';

// Content sections
import {
  SECTION_RICH_TEXT_FRAGMENT,
  SectionRichText,
  type SectionRichTextFragment,
} from '~/sections/SectionRichText';
import {
  SECTION_IMAGE_WITH_TEXT_FRAGMENT,
  SectionImageWithText,
  type SectionImageWithTextFragment,
} from '~/sections/SectionImageWithText';
import {
  SECTION_VIDEO_FRAGMENT,
  SectionVideo,
  type SectionVideoFragment,
} from '~/sections/SectionVideo';

// Social proof sections
import {
  SECTION_TESTIMONIALS_FRAGMENT,
  SectionTestimonials,
  type SectionTestimonialsFragment,
} from '~/sections/SectionTestimonials';
import {
  SECTION_LOGOS_FRAGMENT,
  SectionLogos,
  type SectionLogosFragment,
} from '~/sections/SectionLogos';

// Utility sections
import {
  SECTION_FAQ_FRAGMENT,
  SectionFAQ,
  type SectionFAQFragment,
} from '~/sections/SectionFAQ';
import {
  SECTION_FEATURES_FRAGMENT,
  SectionFeatures,
  type SectionFeaturesFragment,
} from '~/sections/SectionFeatures';
import {
  SECTION_BANNER_FRAGMENT,
  SectionBanner,
  type SectionBannerFragment,
} from '~/sections/SectionBanner';
import {
  SECTION_COUNTDOWN_FRAGMENT,
  SectionCountdown,
  type SectionCountdownFragment,
} from '~/sections/SectionCountdown';
import {
  SECTION_NEWSLETTER_FRAGMENT,
  SectionNewsletter,
  type SectionNewsletterFragment,
} from '~/sections/SectionNewsletter';

// Union type of all section fragments
export type SectionFragment =
  | SectionHeroFragment
  | SectionHeroSliderFragment
  | SectionFeaturedProductsFragment
  | SectionCollectionGridFragment
  | SectionRichTextFragment
  | SectionImageWithTextFragment
  | SectionVideoFragment
  | SectionTestimonialsFragment
  | SectionLogosFragment
  | SectionFAQFragment
  | SectionFeaturesFragment
  | SectionBannerFragment
  | SectionCountdownFragment
  | SectionNewsletterFragment;

export interface SectionsFragment {
  references?: {
    nodes: Array<SectionFragment & {id: string; type: string}>;
  };
}

export function Sections({sections}: {sections: SectionsFragment}) {
  if (!sections?.references?.nodes) {
    return null;
  }

  return (
    <div className="sections">
      {sections.references.nodes.map((section) => {
        switch (section.type) {
          // Hero sections
          case 'section_hero':
            return (
              <SectionHero
                {...(section as SectionHeroFragment)}
                key={section.id}
              />
            );
          case 'section_hero_slider':
            return (
              <SectionHeroSlider
                {...(section as SectionHeroSliderFragment)}
                key={section.id}
              />
            );

          // Product/Collection sections
          case 'section_featured_products':
            return (
              <SectionFeaturedProducts
                {...(section as SectionFeaturedProductsFragment)}
                key={section.id}
              />
            );
          case 'section_collection_grid':
            return (
              <SectionCollectionGrid
                {...(section as SectionCollectionGridFragment)}
                key={section.id}
              />
            );

          // Content sections
          case 'section_rich_text':
            return (
              <SectionRichText
                {...(section as SectionRichTextFragment)}
                key={section.id}
              />
            );
          case 'section_image_with_text':
            return (
              <SectionImageWithText
                {...(section as SectionImageWithTextFragment)}
                key={section.id}
              />
            );
          case 'section_video':
            return (
              <SectionVideo
                {...(section as SectionVideoFragment)}
                key={section.id}
              />
            );

          // Social proof sections
          case 'section_testimonials':
            return (
              <SectionTestimonials
                {...(section as SectionTestimonialsFragment)}
                key={section.id}
              />
            );
          case 'section_logos':
            return (
              <SectionLogos
                {...(section as SectionLogosFragment)}
                key={section.id}
              />
            );

          // Utility sections
          case 'section_faq':
            return (
              <SectionFAQ {...(section as SectionFAQFragment)} key={section.id} />
            );
          case 'section_features':
            return (
              <SectionFeatures
                {...(section as SectionFeaturesFragment)}
                key={section.id}
              />
            );
          case 'section_banner':
            return (
              <SectionBanner
                {...(section as SectionBannerFragment)}
                key={section.id}
              />
            );
          case 'section_countdown':
            return (
              <SectionCountdown
                {...(section as SectionCountdownFragment)}
                key={section.id}
              />
            );
          case 'section_newsletter':
            return (
              <SectionNewsletter
                {...(section as SectionNewsletterFragment)}
                key={section.id}
              />
            );

          default:
            if (process.env.NODE_ENV === 'development') {
              console.log(`Unknown section type: ${section.type}`);
            }
            return null;
        }
      })}
    </div>
  );
}

/**
 * Combined GraphQL fragment for all sections.
 * This is used in the RouteContent query to fetch section data.
 */
export const SECTIONS_FRAGMENT = `#graphql
  fragment Sections on MetaobjectField {
    references(first: 20) {
      nodes {
        ... on Metaobject {
          id
          type
          # Hero sections
          ...SectionHero
          ...SectionHeroSlider
          # Product/Collection sections
          ...SectionFeaturedProducts
          ...SectionCollectionGrid
          # Content sections
          ...SectionRichText
          ...SectionImageWithText
          ...SectionVideo
          # Social proof sections
          ...SectionTestimonials
          ...SectionLogos
          # Utility sections
          ...SectionFAQ
          ...SectionFeatures
          ...SectionBanner
          ...SectionCountdown
          ...SectionNewsletter
        }
      }
    }
  }
  ${SECTION_HERO_FRAGMENT}
  ${SECTION_HERO_SLIDER_FRAGMENT}
  ${SECTION_FEATURED_PRODUCTS_FRAGMENT}
  ${SECTION_COLLECTION_GRID_FRAGMENT}
  ${SECTION_RICH_TEXT_FRAGMENT}
  ${SECTION_IMAGE_WITH_TEXT_FRAGMENT}
  ${SECTION_VIDEO_FRAGMENT}
  ${SECTION_TESTIMONIALS_FRAGMENT}
  ${SECTION_LOGOS_FRAGMENT}
  ${SECTION_FAQ_FRAGMENT}
  ${SECTION_FEATURES_FRAGMENT}
  ${SECTION_BANNER_FRAGMENT}
  ${SECTION_COUNTDOWN_FRAGMENT}
  ${SECTION_NEWSLETTER_FRAGMENT}
`;
