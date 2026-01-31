import {Link} from '@remix-run/react';
import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';

/**
 * Promotional Banner section - simple text + optional CTA.
 *
 * Metaobject Definition (create in Shopify Admin):
 * Type: section_banner
 * Fields:
 *   - text (Single line text) - e.g., "Free shipping on orders over $50"
 *   - link_text (Single line text) - e.g., "Shop Now"
 *   - link_url (Single line text)
 *   - background_color (Single line text) - hex color, e.g., "#000000"
 *   - text_color (Single line text) - hex color, e.g., "#ffffff"
 */
export function SectionBanner(props: SectionBannerFragment) {
  const section = parseSection<
    SectionBannerFragment,
    {
      text?: ParsedMetafields['single_line_text_field'];
      link_text?: ParsedMetafields['single_line_text_field'];
      link_url?: ParsedMetafields['single_line_text_field'];
      background_color?: ParsedMetafields['single_line_text_field'];
      text_color?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {text, link_text, link_url, background_color, text_color} = section;

  const style: React.CSSProperties = {
    backgroundColor: background_color?.parsedValue || '#000000',
    color: text_color?.parsedValue || '#ffffff',
  };

  return (
    <section className="section-banner" style={style}>
      <div className="section-banner__content">
        {text?.parsedValue && (
          <p className="section-banner__text">{text.parsedValue}</p>
        )}
        {link_url?.parsedValue && link_text?.parsedValue && (
          <Link
            to={link_url.parsedValue}
            className="section-banner__link"
            style={{color: text_color?.parsedValue || '#ffffff'}}
          >
            {link_text.parsedValue}
          </Link>
        )}
      </div>
    </section>
  );
}

export interface SectionBannerFragment {
  type: string;
  id?: string;
  text?: {
    key: string;
    value: string;
    type?: string;
  };
  link_text?: {
    key: string;
    value: string;
    type?: string;
  };
  link_url?: {
    key: string;
    value: string;
    type?: string;
  };
  background_color?: {
    key: string;
    value: string;
    type?: string;
  };
  text_color?: {
    key: string;
    value: string;
    type?: string;
  };
}

export const SECTION_BANNER_FRAGMENT = `#graphql
  fragment SectionBanner on Metaobject {
    type
    id
    text: field(key: "text") {
      key
      value
      type
    }
    link_text: field(key: "link_text") {
      key
      value
      type
    }
    link_url: field(key: "link_url") {
      key
      value
      type
    }
    background_color: field(key: "background_color") {
      key
      value
      type
    }
    text_color: field(key: "text_color") {
      key
      value
      type
    }
  }
`;
