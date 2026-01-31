import {Link} from '@remix-run/react';
import type {LoaderArgs, V2_MetaFunction} from '@shopify/remix-oxygen';

export const meta: V2_MetaFunction = () => {
  return [{title: 'Page Not Found | Mock.shop'}];
};

export async function loader({request}: LoaderArgs) {
  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404,
  });
}

export default function CatchAllPage() {
  return <NotFound />;
}

export function ErrorBoundary() {
  return <NotFound />;
}

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page not found</h2>
        <p className="not-found-description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-button primary">
            Go to Homepage
          </Link>
          <Link to="/collections" className="not-found-button secondary">
            Browse Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
