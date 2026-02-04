import {useLoaderData, Link} from '@remix-run/react';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';

// Whitelist of relevant collection handles for the storefront
// Filter out art/artist collections that don't match our product catalog
const RELEVANT_COLLECTIONS = new Set([
  'new-arrivals',
  't-shirts',
  'hoodies',
  'men',
  'women',
  'unisex',
  'tops',
  'bottoms',
  'accessories',
  'featured',
  'shoes',
  'all',
  'apparel',
  'footwear',
  'outerwear',
]);

export async function loader({context, request}: LoaderArgs) {
  // Fetch more collections to account for filtering
  const {collections: allCollections} = await context.storefront.query(
    COLLECTIONS_QUERY,
    {
      variables: {first: 100},
    },
  );

  // Filter to only relevant collections
  const filteredNodes = allCollections.nodes.filter(
    (collection: CollectionFragment) =>
      RELEVANT_COLLECTIONS.has(collection.handle),
  );

  // Create a filtered connection object for the component
  const collections = {
    nodes: filteredNodes,
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
  };

  return json({collections});
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="collections-page">
      <h1>Collections</h1>
      <CollectionsGrid collections={collections.nodes} />
    </div>
  );
}

function CollectionsGrid({collections}: {collections: CollectionFragment[]}) {
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
  collection: CollectionFragment;
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
  fragment Collection on Collection {
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
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
