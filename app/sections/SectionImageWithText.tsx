import {Link} from '@remix-run/react';
import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';

/**
 * Image with Text section - great for feature highlights, promos.
 *
 * Metaobject Definition (create in Shopify Admin):
 * Type: section_image_with_text
 * Fields:
 *   - heading (Single line text)
 *   - body (Single line text or Multi-line text)
 *   - image (File - Images only)
 *   - button_text (Single line text)
 *   - button_link (Single line text - URL)
 *   - image_position (Single line text) - "left" or "right"
 */
export function SectionImageWithText(props: SectionImageWithTextFragment) {
  const section = parseSection<
    SectionImageWithTextFragment,
    {
      heading?: ParsedMetafields['single_line_text_field'];
      body?: ParsedMetafields['single_line_text_field'];
      button_text?: ParsedMetafields['single_line_text_field'];
      button_link?: ParsedMetafields['single_line_text_field'];
      image_position?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {heading, body, image, button_text, button_link, image_position} = section;
  const imageUrl = image?.image?.url;
  const isImageRight = image_position?.parsedValue === 'right';

  return (
    <section className={`midweight-section ${isImageRight ? 'image-right' : ''}`}>
      {imageUrl && (
        <img src={imageUrl} alt={heading?.parsedValue || 'Feature image'} />
      )}
      <div className="midweight-content">
        {heading?.parsedValue && <h2>{heading.parsedValue}</h2>}
        {body?.parsedValue && <p>{body.parsedValue}</p>}
        {button_link?.parsedValue && (
          <Link to={button_link.parsedValue} className="midweight-button">
            {button_text?.parsedValue || 'Learn more'}
          </Link>
        )}
      </div>
    </section>
  );
}

// TypeScript interface
export interface SectionImageWithTextFragment {
  type: string;
  id?: string;
  heading?: {
    key: string;
    value: string;
    type?: string;
  };
  body?: {
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
  image_position?: {
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
  fragment SectionImageWithTextMediaImage on MediaImage {
    image {
      altText
      url
      width
      height
    }
  }
`;

export const SECTION_IMAGE_WITH_TEXT_FRAGMENT = `#graphql
  fragment SectionImageWithText on Metaobject {
    type
    id
    heading: field(key: "heading") {
      key
      value
      type
    }
    body: field(key: "body") {
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
    image_position: field(key: "image_position") {
      key
      value
      type
    }
    image: field(key: "image") {
      key
      reference {
        ... on MediaImage {
          ...SectionImageWithTextMediaImage
        }
      }
    }
  }
  ${MEDIA_IMAGE_FRAGMENT}
`;
