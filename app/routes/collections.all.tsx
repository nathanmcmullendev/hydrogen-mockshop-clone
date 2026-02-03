import {redirect, type LoaderArgs} from '@shopify/remix-oxygen';

/**
 * Redirect /collections/all to /products
 *
 * Many Shopify themes use /collections/all to show all products.
 * This redirect ensures compatibility with existing links and navigation.
 */
export async function loader({request}: LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = url.search;
  return redirect(`/products${searchParams}`, 301);
}

export default function CollectionsAll() {
  return null;
}
