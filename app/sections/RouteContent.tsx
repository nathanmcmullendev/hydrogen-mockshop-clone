/**
 * Route Content Component
 *
 * This component fetches and renders content from a "route" metaobject.
 * Each route metaobject contains a list of section references that define
 * what appears on the page.
 *
 * Usage in a route:
 * ```tsx
 * import {ROUTE_CONTENT_QUERY, RouteContent} from '~/sections/RouteContent';
 *
 * export async function loader({context}: LoaderArgs) {
 *   const {route} = await context.storefront.query(ROUTE_CONTENT_QUERY, {
 *     variables: {handle: 'route-home'},
 *   });
 *   return {route};
 * }
 *
 * export default function Page() {
 *   const {route} = useLoaderData();
 *   return <RouteContent route={route} />;
 * }
 * ```
 *
 * Metaobject Definition (create in Shopify Admin):
 * Type: route
 * Fields:
 *   - title (Single line text) - Page title
 *   - sections (Metaobject reference - List) - References to section metaobjects
 */

import {SECTIONS_FRAGMENT, Sections, type SectionsFragment} from '~/sections/Sections';

export interface RouteContentData {
  type?: string;
  id?: string;
  title?: {
    key: string;
    value: string;
  };
  sections?: SectionsFragment;
}

interface RouteContentProps {
  route: RouteContentData | null;
  fallback?: React.ReactNode;
}

export function RouteContent({route, fallback}: RouteContentProps) {
  // If no route data, render fallback or nothing
  if (!route?.sections?.references?.nodes?.length) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null;
  }

  return (
    <div className="route-content">
      <Sections sections={route.sections} />
    </div>
  );
}

/**
 * GraphQL query to fetch route content by handle.
 *
 * The handle should match the metaobject handle in Shopify Admin.
 * Convention: use "route-{page}" format, e.g., "route-home", "route-about"
 */
export const ROUTE_CONTENT_QUERY = `#graphql
  query RouteContent($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    route: metaobject(handle: {type: "route", handle: $handle}) {
      type
      id
      title: field(key: "title") {
        key
        value
      }
      sections: field(key: "sections") {
        ...Sections
      }
    }
  }
  ${SECTIONS_FRAGMENT}
`;

/**
 * Helper to check if route content exists
 */
export function hasRouteContent(route: RouteContentData | null): boolean {
  return Boolean(route?.sections?.references?.nodes?.length);
}
