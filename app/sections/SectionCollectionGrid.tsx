import {Image} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';

/**
 * Collection Grid section - displays collection cards.
 *
 * Metaobject Definition (create in Shopify Admin):
 * Type: section_collection_grid
 * Fields:
 *   - heading (Single line text)
 *   - subheading (Single line text)
 *   - collections (Collection reference - List)
 *   - columns (Number integer) - 2, 3, or 4
 */
export function SectionCollectionGrid(props: SectionCollectionGridFragment) {
  const section = parseSection<
    SectionCollectionGridFragment,
    {
      heading?: ParsedMetafields['single_line_text_field'];
      subheading?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {heading, subheading, collections, columns} = section;
  const columnCount = columns?.value ? parseInt(columns.value) : 3;

  return (
    <section className="section-collection-grid">
      <div className="section-collection-grid__header">
        {heading?.parsedValue && (
          <h2 className="section-collection-grid__heading">
            {heading.parsedValue}
          </h2>
        )}
        {subheading?.parsedValue && (
          <p className="section-collection-grid__subheading">
            {subheading.parsedValue}
          </p>
        )}
      </div>
      {collections?.nodes && (
        <div
          className="section-collection-grid__grid"
          style={
            {
              '--columns': columnCount,
            } as React.CSSProperties
          }
        >
          {collections.nodes.map((collection) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.handle}`}
              className="collection-card"
            >
              {collection.image && (
                <div className="collection-card__image">
                  <Image
                    data={collection.image}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 30vw, 50vw"
                  />
                </div>
              )}
              <div className="collection-card__content">
                <h3 className="collection-card__title">{collection.title}</h3>
                {collection.description && (
                  <p className="collection-card__description">
                    {collection.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export interface SectionCollectionGridFragment {
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
  collections?: {
    references?: {
      nodes: Array<{
        id: string;
        title: string;
        handle: string;
        description?: string;
        image?: {
          url: string;
          altText?: string;
          width?: number;
          height?: number;
        };
      }>;
    };
  };
}

export const SECTION_COLLECTION_GRID_FRAGMENT = `#graphql
  fragment SectionCollectionGrid on Metaobject {
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
    collections: field(key: "collections") {
      references(first: 12) {
        nodes {
          ... on Collection {
            id
            title
            handle
            description
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;
