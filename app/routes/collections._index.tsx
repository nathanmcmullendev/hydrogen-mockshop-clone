import {useLoaderData, Link} from '@remix-run/react';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {Image} from '@shopify/hydrogen';

// Collection type with product count
interface CollectionWithProducts {
  id: string;
  title: string;
  handle: string;
  image?: {
    id: string;
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
  products: {
    nodes: Array<{id: string}>;
  };
}

export async function loader({context}: LoaderArgs) {
  const {collections: allCollections} = await context.storefront.query(
    COLLECTIONS_QUERY,
    {
      variables: {first: 100},
    },
  );

  // Filter to only collections that have products
  const filteredNodes = allCollections.nodes.filter(
    (collection: CollectionWithProducts) => collection.products.nodes.length > 0,
  );

  return json({collections: filteredNodes});
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="collections-page">
      <h1>Collections</h1>
      <CollectionsGrid collections={collections} />
    </div>
  );
}

function CollectionsGrid({
  collections,
}: {
  collections: CollectionWithProducts[];
}) {
  return (
    <div className="collections-grid">
      {collections.map((collection, index) => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          index={index}
        />
      ))}
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionWithProducts;
  index: number;
}) {
  return (
    <Link
      className="collection-item"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      {collection.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="1/1"
          data={collection.image}
          loading={index < 3 ? 'eager' : undefined}
        />
      )}
      <h5>{collection.title}</h5>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query StoreCollections(
    $country: CountryCode
    $first: Int
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collections(first: $first) {
      nodes {
        id
        title
        handle
        image {
          id
          url
          altText
          width
          height
        }
        products(first: 1) {
          nodes {
            id
          }
        }
      }
    }
  }
` as const;
