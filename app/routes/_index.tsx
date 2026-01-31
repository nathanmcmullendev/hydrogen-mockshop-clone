import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';

export const meta: V2_MetaFunction = () => {
  return [{title: 'Mock.shop | Home'}];
};

export async function loader({context}: LoaderArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({featuredCollection, recommendedProducts});
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <HeroSection />
      <RecommendedProducts products={data.recommendedProducts} />
      <LifestyleSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero-section">
      <img
        src="https://cdn.shopify.com/s/files/1/0688/1755/1382/files/banner-1.png?v=1675455659"
        alt="The Peak Collection"
      />
      <div className="hero-content">
        <h1>The Peak<br />Collection</h1>
        <p>Push your performance with our premium athletic wear</p>
        <Link to="/collections/featured" className="hero-button">
          Shop now
        </Link>
      </div>
    </section>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div className="recommended-products">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid">
              {products.nodes.map((product) => (
                <Link
                  key={product.id}
                  className="recommended-product"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h4>{product.title}</h4>
                  <small>
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

function LifestyleSection() {
  return (
    <section className="lifestyle-section">
      <div className="lifestyle-image">
        <img
          src="https://cdn.shopify.com/s/files/1/0688/1755/1382/files/banner-3.png?v=1675456899"
          alt="Lifestyle"
        />
      </div>
      <div className="lifestyle-content">
        <h2>Clothes that work as hard as you do.</h2>
        <Link to="/collections" className="lifestyle-button">
          Shop now
        </Link>
      </div>
      <div className="lifestyle-image">
        <img
          src="https://cdn.shopify.com/s/files/1/0688/1755/1382/files/banner-4.png?v=1675456929"
          alt="Lifestyle"
        />
      </div>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 6, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
