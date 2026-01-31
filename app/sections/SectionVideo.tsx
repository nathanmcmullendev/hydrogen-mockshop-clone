import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';

/**
 * Video Embed section - YouTube, Vimeo, or direct video.
 *
 * Metaobject Definition (create in Shopify Admin):
 * Type: section_video
 * Fields:
 *   - heading (Single line text)
 *   - subheading (Single line text)
 *   - video_url (Single line text) - YouTube/Vimeo URL or direct video URL
 *   - video_file (File - Videos only) - Alternative: upload video directly
 *   - poster_image (File - Images only) - Thumbnail/poster
 *   - autoplay (True/false)
 *   - loop (True/false)
 *   - muted (True/false)
 */
export function SectionVideo(props: SectionVideoFragment) {
  const section = parseSection<
    SectionVideoFragment,
    {
      heading?: ParsedMetafields['single_line_text_field'];
      subheading?: ParsedMetafields['single_line_text_field'];
      video_url?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {
    heading,
    subheading,
    video_url,
    video_file,
    poster_image,
    autoplay,
    loop,
    muted,
  } = section;

  const videoSrc = video_file?.sources?.[0]?.url || video_url?.parsedValue;
  const posterSrc = poster_image?.image?.url;
  const isAutoplay = autoplay?.value === 'true';
  const isLoop = loop?.value === 'true';
  const isMuted = muted?.value === 'true' || isAutoplay; // Autoplay requires muted

  // Check if it's a YouTube or Vimeo URL
  const youtubeId = getYouTubeId(video_url?.parsedValue);
  const vimeoId = getVimeoId(video_url?.parsedValue);

  return (
    <section className="section-video">
      {(heading?.parsedValue || subheading?.parsedValue) && (
        <div className="section-video__header">
          {heading?.parsedValue && (
            <h2 className="section-video__heading">{heading.parsedValue}</h2>
          )}
          {subheading?.parsedValue && (
            <p className="section-video__subheading">{subheading.parsedValue}</p>
          )}
        </div>
      )}
      <div className="section-video__container">
        {youtubeId ? (
          <iframe
            className="section-video__iframe"
            src={`https://www.youtube.com/embed/${youtubeId}${isAutoplay ? '?autoplay=1&mute=1' : ''}`}
            title={heading?.parsedValue || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : vimeoId ? (
          <iframe
            className="section-video__iframe"
            src={`https://player.vimeo.com/video/${vimeoId}${isAutoplay ? '?autoplay=1&muted=1' : ''}`}
            title={heading?.parsedValue || 'Video'}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : videoSrc ? (
          <video
            className="section-video__player"
            src={videoSrc}
            poster={posterSrc}
            autoPlay={isAutoplay}
            loop={isLoop}
            muted={isMuted}
            controls={!isAutoplay}
            playsInline
          />
        ) : (
          <div className="section-video__placeholder">
            <p>No video configured</p>
          </div>
        )}
      </div>
    </section>
  );
}

// Helper to extract YouTube video ID
function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
  );
  return match ? match[1] : null;
}

// Helper to extract Vimeo video ID
function getVimeoId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export interface SectionVideoFragment {
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
  video_url?: {
    key: string;
    value: string;
    type?: string;
  };
  video_file?: {
    reference?: {
      sources?: Array<{
        url: string;
        mimeType: string;
      }>;
    };
  };
  poster_image?: {
    reference?: {
      image?: {
        url: string;
        altText?: string;
      };
    };
  };
  autoplay?: {
    key: string;
    value: string;
  };
  loop?: {
    key: string;
    value: string;
  };
  muted?: {
    key: string;
    value: string;
  };
}

export const SECTION_VIDEO_FRAGMENT = `#graphql
  fragment SectionVideo on Metaobject {
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
    video_url: field(key: "video_url") {
      key
      value
      type
    }
    video_file: field(key: "video_file") {
      reference {
        ... on Video {
          sources {
            url
            mimeType
          }
        }
      }
    }
    poster_image: field(key: "poster_image") {
      reference {
        ... on MediaImage {
          image {
            url
            altText
          }
        }
      }
    }
    autoplay: field(key: "autoplay") {
      key
      value
    }
    loop: field(key: "loop") {
      key
      value
    }
    muted: field(key: "muted") {
      key
      value
    }
  }
`;
