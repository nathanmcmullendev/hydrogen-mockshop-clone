import {useState, useEffect} from 'react';
import {Link} from '@remix-run/react';
import type {ParsedMetafields} from '@shopify/hydrogen';
import {parseSection} from '~/utils/parseSection';

/**
 * Countdown Timer section for sales/promotions.
 *
 * Metaobject Definition (create in Shopify Admin):
 * Type: section_countdown
 * Fields:
 *   - heading (Single line text) - e.g., "Sale ends in"
 *   - subheading (Single line text)
 *   - end_date (Date and time) - When the countdown ends
 *   - expired_text (Single line text) - Text to show when expired
 *   - button_text (Single line text)
 *   - button_link (Single line text)
 *   - background_color (Single line text) - hex color
 *   - text_color (Single line text) - hex color
 */
export function SectionCountdown(props: SectionCountdownFragment) {
  const section = parseSection<
    SectionCountdownFragment,
    {
      heading?: ParsedMetafields['single_line_text_field'];
      subheading?: ParsedMetafields['single_line_text_field'];
      expired_text?: ParsedMetafields['single_line_text_field'];
      button_text?: ParsedMetafields['single_line_text_field'];
      button_link?: ParsedMetafields['single_line_text_field'];
      background_color?: ParsedMetafields['single_line_text_field'];
      text_color?: ParsedMetafields['single_line_text_field'];
    }
  >(props);

  const {
    heading,
    subheading,
    end_date,
    expired_text,
    button_text,
    button_link,
    background_color,
    text_color,
  } = section;

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(end_date?.value));
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(end_date?.value);
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        setIsExpired(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [end_date?.value]);

  const style: React.CSSProperties = {
    backgroundColor: background_color?.parsedValue || '#000000',
    color: text_color?.parsedValue || '#ffffff',
  };

  if (isExpired && !expired_text?.parsedValue) {
    return null; // Hide section if expired and no expired text
  }

  return (
    <section className="section-countdown" style={style}>
      <div className="section-countdown__content">
        {heading?.parsedValue && (
          <h2 className="section-countdown__heading">{heading.parsedValue}</h2>
        )}
        {subheading?.parsedValue && (
          <p className="section-countdown__subheading">
            {subheading.parsedValue}
          </p>
        )}

        {isExpired ? (
          <p className="section-countdown__expired">
            {expired_text?.parsedValue || 'This offer has ended'}
          </p>
        ) : (
          <div className="section-countdown__timer">
            <div className="section-countdown__unit">
              <span className="section-countdown__number">{timeLeft.days}</span>
              <span className="section-countdown__label">Days</span>
            </div>
            <div className="section-countdown__separator">:</div>
            <div className="section-countdown__unit">
              <span className="section-countdown__number">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="section-countdown__label">Hours</span>
            </div>
            <div className="section-countdown__separator">:</div>
            <div className="section-countdown__unit">
              <span className="section-countdown__number">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="section-countdown__label">Min</span>
            </div>
            <div className="section-countdown__separator">:</div>
            <div className="section-countdown__unit">
              <span className="section-countdown__number">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="section-countdown__label">Sec</span>
            </div>
          </div>
        )}

        {!isExpired && button_link?.parsedValue && button_text?.parsedValue && (
          <Link
            to={button_link.parsedValue}
            className="section-countdown__button"
            style={{
              borderColor: text_color?.parsedValue || '#ffffff',
              color: text_color?.parsedValue || '#ffffff',
            }}
          >
            {button_text.parsedValue}
          </Link>
        )}
      </div>
    </section>
  );
}

function calculateTimeLeft(endDateString?: string) {
  if (!endDateString) {
    return {days: 0, hours: 0, minutes: 0, seconds: 0};
  }

  const endDate = new Date(endDateString).getTime();
  const now = new Date().getTime();
  const difference = endDate - now;

  if (difference <= 0) {
    return {days: 0, hours: 0, minutes: 0, seconds: 0};
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export interface SectionCountdownFragment {
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
  end_date?: {
    key: string;
    value: string;
  };
  expired_text?: {
    key: string;
    value: string;
    type?: string;
  };
  button_text?: {
    key: string;
    value: string;
    type?: string;
  };
  button_link?: {
    key: string;
    value: string;
    type?: string;
  };
  background_color?: {
    key: string;
    value: string;
    type?: string;
  };
  text_color?: {
    key: string;
    value: string;
    type?: string;
  };
}

export const SECTION_COUNTDOWN_FRAGMENT = `#graphql
  fragment SectionCountdown on Metaobject {
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
    end_date: field(key: "end_date") {
      key
      value
    }
    expired_text: field(key: "expired_text") {
      key
      value
      type
    }
    button_text: field(key: "button_text") {
      key
      value
      type
    }
    button_link: field(key: "button_link") {
      key
      value
      type
    }
    background_color: field(key: "background_color") {
      key
      value
      type
    }
    text_color: field(key: "text_color") {
      key
      value
      type
    }
  }
`;
