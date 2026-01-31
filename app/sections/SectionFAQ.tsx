import {useState} from 'react';
import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';

/**
 * FAQ Accordion section.
 *
 * Metaobject Definition (create in Shopify Admin):
 * Type: section_faq
 * Fields:
 *   - heading (Single line text) - e.g., "Frequently Asked Questions"
 *   - subheading (Single line text)
 *   - faqs (Metaobject reference - List) → references "faq_item" type
 *
 * Also create a "faq_item" metaobject:
 * Type: faq_item
 * Fields:
 *   - question (Single line text)
 *   - answer (Multi-line text)
 */
export function SectionFAQ(props: SectionFAQFragment) {
  const section = parseSection<
    SectionFAQFragment,
    {
      heading?: ParsedMetafields['single_line_text_field'];
      subheading?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {heading, subheading, faqs} = section;

  return (
    <section className="section-faq">
      <div className="section-faq__header">
        {heading?.parsedValue && (
          <h2 className="section-faq__heading">{heading.parsedValue}</h2>
        )}
        {subheading?.parsedValue && (
          <p className="section-faq__subheading">{subheading.parsedValue}</p>
        )}
      </div>
      {faqs?.nodes && (
        <div className="section-faq__list">
          {faqs.nodes.map((faq, index) => (
            <FAQItem
              key={faq.id || index}
              question={faq.question?.value}
              answer={faq.answer?.value}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function FAQItem({question, answer}: {question?: string; answer?: string}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!question) return null;

  return (
    <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
      <button
        className="faq-item__question"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <span className="faq-item__icon">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && answer && (
        <div className="faq-item__answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export interface SectionFAQFragment {
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
  faqs?: {
    references?: {
      nodes: Array<{
        id?: string;
        question?: {key: string; value: string};
        answer?: {key: string; value: string};
      }>;
    };
  };
}

const FAQ_ITEM_FRAGMENT = `#graphql
  fragment FAQItem on Metaobject {
    id
    question: field(key: "question") {
      key
      value
    }
    answer: field(key: "answer") {
      key
      value
    }
  }
`;

export const SECTION_FAQ_FRAGMENT = `#graphql
  fragment SectionFAQ on Metaobject {
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
    faqs: field(key: "faqs") {
      references(first: 20) {
        nodes {
          ... on Metaobject {
            ...FAQItem
          }
        }
      }
    }
  }
  ${FAQ_ITEM_FRAGMENT}
`;
