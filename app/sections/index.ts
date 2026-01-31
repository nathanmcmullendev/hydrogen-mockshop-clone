/**
 * Section Components Index
 *
 * This file exports all section-related components and utilities.
 * Import from here for cleaner imports:
 *
 * ```tsx
 * import {RouteContent, ROUTE_CONTENT_QUERY} from '~/sections';
 * ```
 */

// Main components
export {RouteContent, ROUTE_CONTENT_QUERY, hasRouteContent} from './RouteContent';
export type {RouteContentData} from './RouteContent';

export {Sections, SECTIONS_FRAGMENT} from './Sections';
export type {SectionsFragment, SectionFragment} from './Sections';

// ============================================
// Individual Sections (14 total)
// ============================================

// Hero sections
export {SectionHero, SECTION_HERO_FRAGMENT} from './SectionHero';
export {SectionHeroSlider, SECTION_HERO_SLIDER_FRAGMENT} from './SectionHeroSlider';

// Product/Collection sections
export {SectionFeaturedProducts, SECTION_FEATURED_PRODUCTS_FRAGMENT} from './SectionFeaturedProducts';
export {SectionCollectionGrid, SECTION_COLLECTION_GRID_FRAGMENT} from './SectionCollectionGrid';

// Content sections
export {SectionRichText, SECTION_RICH_TEXT_FRAGMENT} from './SectionRichText';
export {SectionImageWithText, SECTION_IMAGE_WITH_TEXT_FRAGMENT} from './SectionImageWithText';
export {SectionVideo, SECTION_VIDEO_FRAGMENT} from './SectionVideo';

// Social proof sections
export {SectionTestimonials, SECTION_TESTIMONIALS_FRAGMENT} from './SectionTestimonials';
export {SectionLogos, SECTION_LOGOS_FRAGMENT} from './SectionLogos';

// Utility sections
export {SectionFAQ, SECTION_FAQ_FRAGMENT} from './SectionFAQ';
export {SectionFeatures, SECTION_FEATURES_FRAGMENT} from './SectionFeatures';
export {SectionBanner, SECTION_BANNER_FRAGMENT} from './SectionBanner';
export {SectionCountdown, SECTION_COUNTDOWN_FRAGMENT} from './SectionCountdown';
export {SectionNewsletter, SECTION_NEWSLETTER_FRAGMENT} from './SectionNewsletter';
