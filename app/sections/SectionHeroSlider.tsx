import {useState, useEffect, useCallback} from 'react';
import {Link} from '@remix-run/react';
import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';

/**
 * Hero Slider/Carousel section.
 *
 * Metaobject Definition (create in Shopify Admin):
 * Type: section_hero_slider
 * Fields:
 *   - slides (Metaobject reference - List) → references "hero_slide" type
 *   - autoplay (True/false)
 *   - autoplay_speed (Number integer) - milliseconds, e.g., 5000
 *
 * Also create a "hero_slide" metaobject:
 * Type: hero_slide
 * Fields:
 *   - heading (Single line text)
 *   - subheading (Single line text)
 *   - image (File - Images only)
 *   - button_text (Single line text)
 *   - button_link (Single line text)
 */
export function SectionHeroSlider(props: SectionHeroSliderFragment) {
  const section = parseSection<SectionHeroSliderFragment, {}>(props);

  const {slides, autoplay, autoplay_speed} = section;
  const [currentSlide, setCurrentSlide] = useState(0);

  const slideCount = slides?.nodes?.length || 0;
  const isAutoplay = autoplay?.value === 'true';
  const speed = autoplay_speed?.value ? parseInt(autoplay_speed.value) : 5000;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    if (!isAutoplay || slideCount <= 1) return;

    const interval = setInterval(nextSlide, speed);
    return () => clearInterval(interval);
  }, [isAutoplay, speed, slideCount, nextSlide]);

  if (!slides?.nodes?.length) return null;

  return (
    <section className="section-hero-slider">
      <div className="section-hero-slider__container">
        {slides.nodes.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`section-hero-slider__slide ${
              index === currentSlide ? 'active' : ''
            }`}
            style={{
              backgroundImage: slide.image?.image?.url
                ? `url("${slide.image.image.url}")`
                : undefined,
            }}
          >
            <div className="section-hero-slider__content">
              {slide.heading?.value && (
                <h1
                  dangerouslySetInnerHTML={{
                    __html: slide.heading.value.replace(/\\n/g, '<br />'),
                  }}
                />
              )}
              {slide.subheading?.value && <p>{slide.subheading.value}</p>}
              {slide.button_link?.value && (
                <Link
                  to={slide.button_link.value}
                  className="section-hero-slider__button"
                >
                  {slide.button_text?.value || 'Shop now'}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {slideCount > 1 && (
        <>
          <button
            className="section-hero-slider__nav section-hero-slider__nav--prev"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            className="section-hero-slider__nav section-hero-slider__nav--next"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            →
          </button>
          <div className="section-hero-slider__dots">
            {slides.nodes.map((_, index) => (
              <button
                key={index}
                className={`section-hero-slider__dot ${
                  index === currentSlide ? 'active' : ''
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export interface SectionHeroSliderFragment {
  type: string;
  id?: string;
  autoplay?: {
    key: string;
    value: string;
  };
  autoplay_speed?: {
    key: string;
    value: string;
  };
  slides?: {
    references?: {
      nodes: Array<{
        id?: string;
        heading?: {key: string; value: string};
        subheading?: {key: string; value: string};
        button_text?: {key: string; value: string};
        button_link?: {key: string; value: string};
        image?: {
          reference?: {
            image?: {
              url: string;
              altText?: string;
            };
          };
        };
      }>;
    };
  };
}

const HERO_SLIDE_FRAGMENT = `#graphql
  fragment HeroSlide on Metaobject {
    id
    heading: field(key: "heading") {
      key
      value
    }
    subheading: field(key: "subheading") {
      key
      value
    }
    button_text: field(key: "button_text") {
      key
      value
    }
    button_link: field(key: "button_link") {
      key
      value
    }
    image: field(key: "image") {
      reference {
        ... on MediaImage {
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

export const SECTION_HERO_SLIDER_FRAGMENT = `#graphql
  fragment SectionHeroSlider on Metaobject {
    type
    id
    autoplay: field(key: "autoplay") {
      key
      value
    }
    autoplay_speed: field(key: "autoplay_speed") {
      key
      value
    }
    slides: field(key: "slides") {
      references(first: 10) {
        nodes {
          ... on Metaobject {
            ...HeroSlide
          }
        }
      }
    }
  }
  ${HERO_SLIDE_FRAGMENT}
`;
