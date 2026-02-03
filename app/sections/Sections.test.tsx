/**
 * Sections Component Tests
 *
 * Tests for the dynamic section renderer that maps
 * metaobject types to React components.
 */
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import {Sections} from './Sections';
import {createMockSection, type SectionType} from '~/test/mocks';

// Mock all section components
vi.mock('~/sections/SectionHero', () => ({
  SECTION_HERO_FRAGMENT: '',
  SectionHero: ({id}: {id: string}) => <div data-testid="section-hero" data-id={id}>Hero Section</div>,
}));

vi.mock('~/sections/SectionHeroSlider', () => ({
  SECTION_HERO_SLIDER_FRAGMENT: '',
  SectionHeroSlider: ({id}: {id: string}) => <div data-testid="section-hero-slider" data-id={id}>Hero Slider</div>,
}));

vi.mock('~/sections/SectionFeaturedProducts', () => ({
  SECTION_FEATURED_PRODUCTS_FRAGMENT: '',
  SectionFeaturedProducts: ({id}: {id: string}) => <div data-testid="section-featured-products" data-id={id}>Featured Products</div>,
}));

vi.mock('~/sections/SectionCollectionGrid', () => ({
  SECTION_COLLECTION_GRID_FRAGMENT: '',
  SectionCollectionGrid: ({id}: {id: string}) => <div data-testid="section-collection-grid" data-id={id}>Collection Grid</div>,
}));

vi.mock('~/sections/SectionRichText', () => ({
  SECTION_RICH_TEXT_FRAGMENT: '',
  SectionRichText: ({id}: {id: string}) => <div data-testid="section-rich-text" data-id={id}>Rich Text</div>,
}));

vi.mock('~/sections/SectionImageWithText', () => ({
  SECTION_IMAGE_WITH_TEXT_FRAGMENT: '',
  SectionImageWithText: ({id}: {id: string}) => <div data-testid="section-image-with-text" data-id={id}>Image With Text</div>,
}));

vi.mock('~/sections/SectionVideo', () => ({
  SECTION_VIDEO_FRAGMENT: '',
  SectionVideo: ({id}: {id: string}) => <div data-testid="section-video" data-id={id}>Video</div>,
}));

vi.mock('~/sections/SectionTestimonials', () => ({
  SECTION_TESTIMONIALS_FRAGMENT: '',
  SectionTestimonials: ({id}: {id: string}) => <div data-testid="section-testimonials" data-id={id}>Testimonials</div>,
}));

vi.mock('~/sections/SectionLogos', () => ({
  SECTION_LOGOS_FRAGMENT: '',
  SectionLogos: ({id}: {id: string}) => <div data-testid="section-logos" data-id={id}>Logos</div>,
}));

vi.mock('~/sections/SectionFAQ', () => ({
  SECTION_FAQ_FRAGMENT: '',
  SectionFAQ: ({id}: {id: string}) => <div data-testid="section-faq" data-id={id}>FAQ</div>,
}));

vi.mock('~/sections/SectionFeatures', () => ({
  SECTION_FEATURES_FRAGMENT: '',
  SectionFeatures: ({id}: {id: string}) => <div data-testid="section-features" data-id={id}>Features</div>,
}));

vi.mock('~/sections/SectionBanner', () => ({
  SECTION_BANNER_FRAGMENT: '',
  SectionBanner: ({id}: {id: string}) => <div data-testid="section-banner" data-id={id}>Banner</div>,
}));

vi.mock('~/sections/SectionCountdown', () => ({
  SECTION_COUNTDOWN_FRAGMENT: '',
  SectionCountdown: ({id}: {id: string}) => <div data-testid="section-countdown" data-id={id}>Countdown</div>,
}));

vi.mock('~/sections/SectionNewsletter', () => ({
  SECTION_NEWSLETTER_FRAGMENT: '',
  SectionNewsletter: ({id}: {id: string}) => <div data-testid="section-newsletter" data-id={id}>Newsletter</div>,
}));

describe('Sections', () => {
  describe('null handling', () => {
    it('returns null when sections prop is undefined', () => {
      const {container} = render(<Sections sections={undefined as any} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('returns null when sections.references is undefined', () => {
      const {container} = render(<Sections sections={{} as any} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('returns null when sections.references.nodes is undefined', () => {
      const {container} = render(<Sections sections={{references: {}} as any} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('renders empty container when nodes array is empty', () => {
      const {container} = render(
        <Sections sections={{references: {nodes: []}}} />,
      );

      expect(container.querySelector('.sections')).toBeInTheDocument();
      expect(container.querySelector('.sections')?.children).toHaveLength(0);
    });
  });

  describe('section type routing', () => {
    const sectionTypes: Array<{type: SectionType; testId: string}> = [
      {type: 'section_hero', testId: 'section-hero'},
      {type: 'section_hero_slider', testId: 'section-hero-slider'},
      {type: 'section_featured_products', testId: 'section-featured-products'},
      {type: 'section_collection_grid', testId: 'section-collection-grid'},
      {type: 'section_rich_text', testId: 'section-rich-text'},
      {type: 'section_image_with_text', testId: 'section-image-with-text'},
      {type: 'section_video', testId: 'section-video'},
      {type: 'section_testimonials', testId: 'section-testimonials'},
      {type: 'section_logos', testId: 'section-logos'},
      {type: 'section_faq', testId: 'section-faq'},
      {type: 'section_features', testId: 'section-features'},
      {type: 'section_banner', testId: 'section-banner'},
      {type: 'section_countdown', testId: 'section-countdown'},
      {type: 'section_newsletter', testId: 'section-newsletter'},
    ];

    it.each(sectionTypes)(
      'renders $type section correctly',
      ({type, testId}) => {
        const section = createMockSection(type);

        render(
          <Sections
            sections={{
              references: {
                nodes: [section],
              },
            }}
          />,
        );

        expect(screen.getByTestId(testId)).toBeInTheDocument();
      },
    );
  });

  describe('multiple sections', () => {
    it('renders multiple sections in order', () => {
      const sections = [
        createMockSection('section_hero'),
        createMockSection('section_featured_products'),
        createMockSection('section_newsletter'),
      ];

      render(
        <Sections
          sections={{
            references: {
              nodes: sections,
            },
          }}
        />,
      );

      const container = document.querySelector('.sections');
      const children = container?.children;

      expect(children).toHaveLength(3);
      expect(children?.[0]).toHaveAttribute('data-testid', 'section-hero');
      expect(children?.[1]).toHaveAttribute('data-testid', 'section-featured-products');
      expect(children?.[2]).toHaveAttribute('data-testid', 'section-newsletter');
    });

    it('passes section props to components', () => {
      const section = createMockSection('section_hero', {id: 'custom-id-123'});

      render(
        <Sections
          sections={{
            references: {nodes: [section]},
          }}
        />,
      );

      expect(screen.getByTestId('section-hero')).toHaveAttribute('data-id', 'custom-id-123');
    });
  });

  describe('unknown section types', () => {
    const originalEnv = process.env.NODE_ENV;

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('returns null for unknown section types', () => {
      const section = {
        id: 'unknown-1',
        type: 'section_unknown',
      };

      render(
        <Sections
          sections={{
            references: {nodes: [section as any]},
          }}
        />,
      );

      // Container should be present but empty
      const container = document.querySelector('.sections');
      expect(container?.children).toHaveLength(0);
    });

    it('logs warning in development for unknown types', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Temporarily set NODE_ENV
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const section = {
        id: 'unknown-1',
        type: 'section_unknown_type',
      };

      render(
        <Sections
          sections={{
            references: {nodes: [section as any]},
          }}
        />,
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unknown section type'),
      );

      process.env.NODE_ENV = originalNodeEnv;
      consoleSpy.mockRestore();
    });
  });

  describe('section keys', () => {
    it('uses section id as key', () => {
      const sections = [
        createMockSection('section_hero', {id: 'hero-1'}),
        createMockSection('section_hero', {id: 'hero-2'}),
      ];

      render(
        <Sections
          sections={{
            references: {nodes: sections},
          }}
        />,
      );

      // Both sections should render despite same type
      const heroSections = screen.getAllByTestId('section-hero');
      expect(heroSections).toHaveLength(2);
      expect(heroSections[0]).toHaveAttribute('data-id', 'hero-1');
      expect(heroSections[1]).toHaveAttribute('data-id', 'hero-2');
    });
  });

  describe('container element', () => {
    it('wraps sections in div with sections class', () => {
      const section = createMockSection('section_hero');

      const {container} = render(
        <Sections
          sections={{
            references: {nodes: [section]},
          }}
        />,
      );

      expect(container.querySelector('.sections')).toBeInTheDocument();
    });
  });
});
