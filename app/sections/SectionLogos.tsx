import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';

/**
 * Logos/Trust Badges section - display partner/brand logos.
 *
 * Metaobject Definition (create in Shopify Admin):
 * Type: section_logos
 * Fields:
 *   - heading (Single line text) - e.g., "Trusted by" or "As seen in"
 *   - logos (File - Images only - List) - Multiple logo images
 *   - grayscale (True/false) - Display logos in grayscale
 */
export function SectionLogos(props: SectionLogosFragment) {
  const section = parseSection<
    SectionLogosFragment,
    {
      heading?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {heading, logos, grayscale} = section;
  const isGrayscale = grayscale?.value === 'true';

  return (
    <section className="section-logos">
      {heading?.parsedValue && (
        <p className="section-logos__heading">{heading.parsedValue}</p>
      )}
      {logos?.nodes && (
        <div
          className={`section-logos__grid ${isGrayscale ? 'section-logos__grid--grayscale' : ''}`}
        >
          {logos.nodes.map((logo, index) => (
            <div key={index} className="section-logos__item">
              {logo.image?.url && (
                <img
                  src={logo.image.url}
                  alt={logo.image.altText || `Logo ${index + 1}`}
                  className="section-logos__image"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export interface SectionLogosFragment {
  type: string;
  id?: string;
  heading?: {
    key: string;
    value: string;
    type?: string;
  };
  grayscale?: {
    key: string;
    value: string;
  };
  logos?: {
    references?: {
      nodes: Array<{
        image?: {
          url: string;
          altText?: string;
        };
      }>;
    };
  };
}

export const SECTION_LOGOS_FRAGMENT = `#graphql
  fragment SectionLogos on Metaobject {
    type
    id
    heading: field(key: "heading") {
      key
      value
      type
    }
    grayscale: field(key: "grayscale") {
      key
      value
    }
    logos: field(key: "logos") {
      references(first: 20) {
        nodes {
          ... on MediaImage {
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;
