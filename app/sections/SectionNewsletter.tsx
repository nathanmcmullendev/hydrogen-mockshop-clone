import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';

/**
 * Newsletter signup section with optional social links.
 *
 * Metaobject Definition (create in Shopify Admin):
 * Type: section_newsletter
 * Fields:
 *   - heading (Single line text) - e.g., "Stay in the know"
 *   - placeholder (Single line text) - e.g., "Email"
 *   - social_text (Single line text) - e.g., "Follow us on social media"
 *   - twitter_url (Single line text)
 *   - instagram_url (Single line text)
 *   - facebook_url (Single line text)
 *   - youtube_url (Single line text)
 *   - tiktok_url (Single line text)
 */
export function SectionNewsletter(props: SectionNewsletterFragment) {
  const section = parseSection<
    SectionNewsletterFragment,
    {
      heading?: ParsedMetafields['single_line_text_field'];
      placeholder?: ParsedMetafields['single_line_text_field'];
      social_text?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {
    heading,
    placeholder,
    social_text,
    twitter_url,
    instagram_url,
    facebook_url,
    youtube_url,
    tiktok_url,
    pinterest_url,
  } = section;

  const socialLinks = [
    {url: twitter_url?.value, label: 'Twitter', icon: TwitterIcon},
    {url: instagram_url?.value, label: 'Instagram', icon: InstagramIcon},
    {url: facebook_url?.value, label: 'Facebook', icon: FacebookIcon},
    {url: youtube_url?.value, label: 'YouTube', icon: YouTubeIcon},
    {url: pinterest_url?.value, label: 'Pinterest', icon: PinterestIcon},
    {url: tiktok_url?.value, label: 'TikTok', icon: TikTokIcon},
  ].filter((link) => link.url);

  return (
    <section className="newsletter-section">
      {heading?.parsedValue && <h2>{heading.parsedValue}</h2>}
      <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder={placeholder?.parsedValue || 'Email'}
          aria-label="Email address"
        />
        <button type="submit" aria-label="Subscribe">
          →
        </button>
      </form>
      {social_text?.parsedValue && (
        <p className="newsletter-social-text">{social_text.parsedValue}</p>
      )}
      {socialLinks.length > 0 && (
        <div className="newsletter-social-links">
          {socialLinks.map(({url, label, icon: Icon}) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              <Icon />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

// Social media icons
function TwitterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

// TypeScript interface
export interface SectionNewsletterFragment {
  type: string;
  id?: string;
  heading?: {
    key: string;
    value: string;
    type?: string;
  };
  placeholder?: {
    key: string;
    value: string;
    type?: string;
  };
  social_text?: {
    key: string;
    value: string;
    type?: string;
  };
  twitter_url?: {
    key: string;
    value: string;
  };
  instagram_url?: {
    key: string;
    value: string;
  };
  facebook_url?: {
    key: string;
    value: string;
  };
  youtube_url?: {
    key: string;
    value: string;
  };
  pinterest_url?: {
    key: string;
    value: string;
  };
  tiktok_url?: {
    key: string;
    value: string;
  };
}

export const SECTION_NEWSLETTER_FRAGMENT = `#graphql
  fragment SectionNewsletter on Metaobject {
    type
    id
    heading: field(key: "heading") {
      key
      value
      type
    }
    placeholder: field(key: "placeholder") {
      key
      value
      type
    }
    social_text: field(key: "social_text") {
      key
      value
      type
    }
    twitter_url: field(key: "twitter_url") {
      key
      value
    }
    instagram_url: field(key: "instagram_url") {
      key
      value
    }
    facebook_url: field(key: "facebook_url") {
      key
      value
    }
    youtube_url: field(key: "youtube_url") {
      key
      value
    }
    pinterest_url: field(key: "pinterest_url") {
      key
      value
    }
    tiktok_url: field(key: "tiktok_url") {
      key
      value
    }
  }
`;
