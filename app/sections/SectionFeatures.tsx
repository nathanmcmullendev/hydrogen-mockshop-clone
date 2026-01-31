import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';

/**
 * Features/Benefits section - display feature cards with icons.
 *
 * Metaobject Definition (create in Shopify Admin):
 * Type: section_features
 * Fields:
 *   - heading (Single line text)
 *   - subheading (Single line text)
 *   - features (Metaobject reference - List) → references "feature_item" type
 *   - columns (Number integer) - 2, 3, or 4
 *
 * Also create a "feature_item" metaobject:
 * Type: feature_item
 * Fields:
 *   - title (Single line text)
 *   - description (Multi-line text)
 *   - icon (Single line text) - Icon name: truck, shield, refresh, clock, star, heart, check, gift
 *   - icon_image (File - Images only) - Custom icon image (overrides icon)
 */
export function SectionFeatures(props: SectionFeaturesFragment) {
  const section = parseSection<
    SectionFeaturesFragment,
    {
      heading?: ParsedMetafields['single_line_text_field'];
      subheading?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {heading, subheading, features, columns} = section;
  const columnCount = columns?.value ? parseInt(columns.value) : 3;

  return (
    <section className="section-features">
      {(heading?.parsedValue || subheading?.parsedValue) && (
        <div className="section-features__header">
          {heading?.parsedValue && (
            <h2 className="section-features__heading">{heading.parsedValue}</h2>
          )}
          {subheading?.parsedValue && (
            <p className="section-features__subheading">
              {subheading.parsedValue}
            </p>
          )}
        </div>
      )}
      {features?.nodes && (
        <div
          className="section-features__grid"
          style={{'--columns': columnCount} as React.CSSProperties}
        >
          {features.nodes.map((feature, index) => (
            <div key={feature.id || index} className="feature-card">
              <div className="feature-card__icon">
                {feature.icon_image?.image?.url ? (
                  <img
                    src={feature.icon_image.image.url}
                    alt=""
                    className="feature-card__icon-image"
                  />
                ) : (
                  <FeatureIcon name={feature.icon?.value} />
                )}
              </div>
              {feature.title?.value && (
                <h3 className="feature-card__title">{feature.title.value}</h3>
              )}
              {feature.description?.value && (
                <p className="feature-card__description">
                  {feature.description.value}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// Built-in icons for common use cases
function FeatureIcon({name}: {name?: string}) {
  const icons: Record<string, JSX.Element> = {
    truck: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    refresh: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    gift: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
  };

  return icons[name || ''] || icons.check;
}

export interface SectionFeaturesFragment {
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
  columns?: {
    key: string;
    value: string;
  };
  features?: {
    references?: {
      nodes: Array<{
        id?: string;
        title?: {key: string; value: string};
        description?: {key: string; value: string};
        icon?: {key: string; value: string};
        icon_image?: {
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

const FEATURE_ITEM_FRAGMENT = `#graphql
  fragment FeatureItem on Metaobject {
    id
    title: field(key: "title") {
      key
      value
    }
    description: field(key: "description") {
      key
      value
    }
    icon: field(key: "icon") {
      key
      value
    }
    icon_image: field(key: "icon_image") {
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

export const SECTION_FEATURES_FRAGMENT = `#graphql
  fragment SectionFeatures on Metaobject {
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
    columns: field(key: "columns") {
      key
      value
    }
    features: field(key: "features") {
      references(first: 12) {
        nodes {
          ... on Metaobject {
            ...FeatureItem
          }
        }
      }
    }
  }
  ${FEATURE_ITEM_FRAGMENT}
`;
