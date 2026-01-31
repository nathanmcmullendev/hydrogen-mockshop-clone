import {Link} from '@remix-run/react';
import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';

/**
 * Rich Text section for brand messaging, about content, etc.
 *
 * Metaobject Definition (create in Shopify Admin):
 * Type: section_rich_text
 * Fields:
 *   - content (Rich text OR Multi-line text)
 *   - link_text (Single line text) - optional CTA
 *   - link_url (Single line text) - optional CTA URL
 */
export function SectionRichText(props: SectionRichTextFragment) {
  const section = parseSection<
    SectionRichTextFragment,
    {
      content?: ParsedMetafields['multi_line_text_field'];
      link_text?: ParsedMetafields['single_line_text_field'];
      link_url?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {content, link_text, link_url} = section;

  // Split content by newlines to create multiple paragraphs
  const paragraphs = content?.parsedValue?.split('\n').filter(Boolean) || [];

  return (
    <section className="brand-values">
      {paragraphs.map((paragraph, index) => {
        // Check if this paragraph contains a link placeholder like [link text]
        if (link_url?.parsedValue && paragraph.includes('[') && paragraph.includes(']')) {
          const parts = paragraph.split(/\[([^\]]+)\]/);
          return (
            <h2 key={index}>
              {parts.map((part, i) => {
                if (i % 2 === 1) {
                  // This is the link text
                  return (
                    <Link key={i} to={link_url.parsedValue || '#'}>
                      {part}
                    </Link>
                  );
                }
                return part;
              })}
            </h2>
          );
        }
        return <h2 key={index}>{paragraph}</h2>;
      })}
      {link_text?.parsedValue && link_url?.parsedValue && !content?.parsedValue?.includes('[') && (
        <Link to={link_url.parsedValue} className="rich-text-link">
          {link_text.parsedValue}
        </Link>
      )}
    </section>
  );
}

// TypeScript interface
export interface SectionRichTextFragment {
  type: string;
  id?: string;
  content?: {
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
}

export const SECTION_RICH_TEXT_FRAGMENT = `#graphql
  fragment SectionRichText on Metaobject {
    type
    id
    content: field(key: "content") {
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
  }
`;
