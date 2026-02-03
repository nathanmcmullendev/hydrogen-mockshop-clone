import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense, useState} from 'react';
import {Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {
  RouteContent,
  ROUTE_CONTENT_QUERY,
  hasRouteContent,
  type RouteContentData,
} from '~/sections';
import {ProductQuickView, QuickViewButton} from '~/components/ProductQuickView';
import {WishlistButton} from '~/components/Wishlist';
import {
  getOptimizedImageUrl,
  getSrcSet,
  getSizes,
  IMAGE_SIZES,
} from '~/utils/images';

export const meta: V2_MetaFunction = () => {
  return [{title: 'Mock.shop | Home'}];
};

export async function loader({context}: LoaderArgs) {
  const {storefront} = context;

  // Try to load CMS content from metaobjects
  let route: RouteContentData | null = null;
  try {
    const {route: routeData} = await storefront.query(ROUTE_CONTENT_QUERY, {
      variables: {handle: 'route-home'},
    });
    route = routeData;
  } catch (error) {
    // Metaobjects not configured - will use static fallback
    console.log('No metaobjects configured, using static homepage');
  }

  // Always load product data for static fallback
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({route, featuredCollection, recommendedProducts});
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  const [quickViewHandle, setQuickViewHandle] = useState<string | null>(null);

  // If CMS content exists, use it
  if (hasRouteContent(data.route)) {
    return (
      <div className="home">
        <RouteContent route={data.route} />
      </div>
    );
  }

  // Otherwise, render the static homepage
  return (
    <div className="home">
      <HeroSection />
      <NewArrivalsSection
        products={data.recommendedProducts}
        onQuickView={setQuickViewHandle}
      />
      <BrandValuesSection />
      <MidweightSection />
      <NewsletterSection />

      <ProductQuickView
        isOpen={!!quickViewHandle}
        onClose={() => setQuickViewHandle(null)}
        productHandle={quickViewHandle}
      />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero-section">
      <img
        src="https://demostore.mock.shop/cdn/shop/files/DALL_E_2023-02-03_11.19.22_-_basketball_gym_5_1.png?v=1675445658&width=1920"
        alt="The Peak Collection"
      />
      <div className="hero-content">
        <h1>The Peak<br />Collection</h1>
        <p>Push your performance with our premium athletic wear</p>
        <Link to="/collections" className="hero-button">
          Shop now
        </Link>
      </div>
    </section>
  );
}

function NewArrivalsSection({
  products,
  onQuickView,
}: {
  products: Promise<RecommendedProductsQuery>;
  onQuickView: (handle: string) => void;
}) {
  return (
    <section className="new-arrivals">
      <div className="new-arrivals-header">
        <p className="new-arrivals-label">New arrivals</p>
        <h2 className="new-arrivals-title">Spring '23</h2>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="new-arrivals-grid">
              {products.nodes.map((product, index) => {
                const image = product.images.nodes[0];
                const imageUrl = image?.url;
                const imageSrc = imageUrl
                  ? getOptimizedImageUrl(imageUrl, IMAGE_SIZES.thumbnail)
                  : '';
                const imageSrcSet = imageUrl
                  ? getSrcSet(imageUrl, [200, 400, 600, 800])
                  : '';
                const imageSizes = getSizes({
                  '(max-width: 640px)': '50vw',
                  '(max-width: 1024px)': '33vw',
                  default: '20vw',
                });
                // First 4 products are above the fold
                const priority = index < 4;

                return (
                  <div key={product.id} className="new-arrivals-product">
                    <div className="new-arrivals-product-image">
                      <Link to={`/products/${product.handle}`}>
                        {imageUrl ? (
                          <ProductImage
                            src={imageSrc}
                            srcSet={imageSrcSet}
                            sizes={imageSizes}
                            alt={image?.altText || product.title}
                            priority={priority}
                          />
                        ) : (
                          <div className="product-image-placeholder" />
                        )}
                      </Link>
                      <WishlistButton
                        product={{
                          id: product.id,
                          handle: product.handle,
                          title: product.title,
                          price: product.priceRange.minVariantPrice,
                          image: product.images.nodes[0],
                        }}
                      />
                      <QuickViewButton
                        productHandle={product.handle}
                        onQuickView={onQuickView}
                      />
                    </div>
                    <Link
                      className="new-arrivals-product-info"
                      to={`/products/${product.handle}`}
                    >
                      <h4>{product.title}</h4>
                      <small>
                        <Money data={product.priceRange.minVariantPrice} />
                      </small>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </Await>
      </Suspense>
    </section>
  );
}

/**
 * Product image with loading state for home page
 */
function ProductImage({
  src,
  srcSet,
  sizes,
  alt,
  priority,
}: {
  src: string;
  srcSet: string;
  sizes: string;
  alt: string;
  priority: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      width={400}
      height={400}
      onLoad={() => setIsLoaded(true)}
      className={`product-image ${isLoaded ? 'loaded' : ''}`}
      style={{aspectRatio: '1/1', objectFit: 'cover'}}
    />
  );
}

function BrandValuesSection() {
  return (
    <section className="brand-values">
      <h2>Liquid combines comfort, style, and sustainability. Our products are made from organic cotton and crafted in Canada.</h2>
      <h2>Each product features a minimalist aesthetic, with clean lines and neutral colors.</h2>
      <h2>Join the Liquid movement today and <Link to="/products">elevate your style</Link>.</h2>
    </section>
  );
}

function MidweightSection() {
  return (
    <section className="midweight-section">
      <img
        src="https://demostore.mock.shop/cdn/shop/files/second.jpg?v=1675442050&width=1920"
        alt="Midweight classics"
      />
      <div className="midweight-content">
        <h2>Midweight classics</h2>
        <p>Clothes that work as hard as you do.</p>
        <Link to="/collections" className="midweight-button">
          Shop now
        </Link>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="newsletter-section">
      <h2>Stay in the know</h2>
      <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
        <input type="email" placeholder="Email" aria-label="Email address" />
        <button type="submit" aria-label="Subscribe">→</button>
      </form>
      <p className="newsletter-social-text">Follow us on social media</p>
      <div className="newsletter-social-links">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
          </svg>
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
        <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
          </svg>
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        </a>
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
