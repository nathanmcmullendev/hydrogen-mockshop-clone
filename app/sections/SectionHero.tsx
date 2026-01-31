import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';
import {Link} from '@remix-run/react';

/**
 * Hero section component driven by Shopify Metaobjects.
 *
 * Metaobject Definition (create in Shopify Admin):
 * Type: section_hero
 * Fields:
 *   - heading (Single line text)
 *   - subheading (Single line text)
 *   - image (File - Images only)
 *   - button_text (Single line text)
 *   - button_link (Single line text - URL)
 */
export function SectionHero(props: SectionHeroFragment) {
  const section = parseSection<
    SectionHeroFragment,
    {
      heading?: ParsedMetafields['single_line_text_field'];
      subheading?: ParsedMetafields['single_line_text_field'];
      button_text?: ParsedMetafields['single_line_text_field'];
      button_link?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {image, heading, subheading, button_text, button_link} = section;

  const imageUrl = image?.image?.url;

  return (
    <section className="hero-section">
      {imageUrl && <img src={imageUrl} alt={heading?.parsedValue || 'Hero'} />}
      <div className="hero-content">
        {heading && (
          <h1 dangerouslySetInnerHTML={{__html: heading.parsedValue?.replace(/\\n/g, '<br />') || ''}} />
        )}
        {subheading && <p>{subheading.parsedValue}</p>}
        {button_link?.parsedValue && (
          <Link to={button_link.parsedValue} className="hero-button">
            {button_text?.parsedValue || 'Shop now'}
          </Link>
        )}
      </div>
    </section>
  );
}

// TypeScript interface for the fragment result
export interface SectionHeroFragment {
  type: string;
  id?: string;
  heading?: {
    key: string;
    value: string;
    type?: string;
  };
  subheading?: {
    key: string;
    value: string;
    type?: string;
  };
  button_text?: {
    key: string;
    value: string;
    type?: string;
  };
  button_link?: {
    key: string;
    value: string;
    type?: string;
  };
  image?: {
    key: string;
    reference?: {
      image?: {
        altText?: string;
        url: string;
        width?: number;
        height?: number;
      };
    };
  };
}

const MEDIA_IMAGE_FRAGMENT = `#graphql
  fragment SectionHeroMediaImage on MediaImage {
    image {
      altText
      url
      width
      height
    }
  }
`;

export const SECTION_HERO_FRAGMENT = `#graphql
  fragment SectionHero on Metaobject {
    type
    id
    heading: field(key: "heading") {
      key
      value
      type
    }
    subheading: field(key: "subheading") {
      key
      value
      type
    }
    button_text: field(key: "button_text") {
      key
      value
      type
    }
    button_link: field(key: "button_link") {
      key
      value
      type
    }
    image: field(key: "image") {
      key
      reference {
        ... on MediaImage {
          ...SectionHeroMediaImage
        }
      }
    }
  }
  ${MEDIA_IMAGE_FRAGMENT}
`;
