import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';

/**
 * Testimonials/Reviews section.
 *
 * Metaobject Definition (create in Shopify Admin):
 * Type: section_testimonials
 * Fields:
 *   - heading (Single line text) - e.g., "What our customers say"
 *   - testimonials (Metaobject reference - List) → references "testimonial" type
 *
 * Also create a "testimonial" metaobject:
 * Type: testimonial
 * Fields:
 *   - quote (Multi-line text)
 *   - author (Single line text)
 *   - role (Single line text) - e.g., "Verified Buyer"
 *   - rating (Number integer) - 1-5 stars
 *   - avatar (File - Images only)
 */
export function SectionTestimonials(props: SectionTestimonialsFragment) {
  const section = parseSection<
    SectionTestimonialsFragment,
    {
      heading?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {heading, testimonials} = section;

  return (
    <section className="section-testimonials">
      {heading?.parsedValue && (
        <h2 className="section-testimonials__heading">{heading.parsedValue}</h2>
      )}
      {testimonials?.nodes && (
        <div className="section-testimonials__grid">
          {testimonials.nodes.map((testimonial, index) => (
            <div key={testimonial.id || index} className="testimonial-card">
              {testimonial.rating?.value && (
                <div className="testimonial-card__stars">
                  {Array.from({length: 5}).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < parseInt(testimonial.rating?.value || '0')
                          ? 'star filled'
                          : 'star'
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
              {testimonial.quote?.value && (
                <blockquote className="testimonial-card__quote">
                  "{testimonial.quote.value}"
                </blockquote>
              )}
              <div className="testimonial-card__author">
                {testimonial.avatar?.image?.url && (
                  <img
                    src={testimonial.avatar.image.url}
                    alt={testimonial.author?.value || 'Customer'}
                    className="testimonial-card__avatar"
                  />
                )}
                <div className="testimonial-card__info">
                  {testimonial.author?.value && (
                    <span className="testimonial-card__name">
                      {testimonial.author.value}
                    </span>
                  )}
                  {testimonial.role?.value && (
                    <span className="testimonial-card__role">
                      {testimonial.role.value}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export interface SectionTestimonialsFragment {
  type: string;
  id?: string;
  heading?: {
    key: string;
    value: string;
    type?: string;
  };
  testimonials?: {
    references?: {
      nodes: Array<{
        id?: string;
        quote?: {key: string; value: string};
        author?: {key: string; value: string};
        role?: {key: string; value: string};
        rating?: {key: string; value: string};
        avatar?: {
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

const TESTIMONIAL_FRAGMENT = `#graphql
  fragment Testimonial on Metaobject {
    id
    quote: field(key: "quote") {
      key
      value
    }
    author: field(key: "author") {
      key
      value
    }
    role: field(key: "role") {
      key
      value
    }
    rating: field(key: "rating") {
      key
      value
    }
    avatar: field(key: "avatar") {
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

export const SECTION_TESTIMONIALS_FRAGMENT = `#graphql
  fragment SectionTestimonials on Metaobject {
    type
    id
    heading: field(key: "heading") {
      key
      value
      type
    }
    testimonials: field(key: "testimonials") {
      references(first: 10) {
        nodes {
          ... on Metaobject {
            ...Testimonial
          }
        }
      }
    }
  }
  ${TESTIMONIAL_FRAGMENT}
`;
