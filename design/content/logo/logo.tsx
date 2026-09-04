import React from 'react';
import classNames from 'classnames';
import { Link } from '@lov/design.navigation.link';
import styles from './logo.module.scss';

export type LogoSize = 'sm' | 'md' | 'lg';

export type LogoProps = {
  /**
   * size of the logo glyph and wordmark.
   */
  size?: LogoSize;

  /**
   * whether to render the "Inbox Assistant" wordmark next to the glyph.
   */
  showWordmark?: boolean;

  /**
   * when provided, wraps the logo in a link pointing to this destination.
   */
  href?: string;

  /**
   * class name for the logo.
   */
  className?: string;

  /**
   * style for the logo.
   */
  style?: React.CSSProperties;
};

/**
 * an envelope glyph in a rounded square with an indigo-to-violet gradient,
 * next to the "Inbox Assistant" wordmark. Wraps in a Link when href is provided.
 */
export function Logo({
  size = `md`,
  showWordmark = true,
  href,
  className,
  style,
}: LogoProps) {
  const content = (
    <span className={classNames(styles.logo, styles[size], className)} style={style}>
      <span className={styles.glyph}>
        <svg
          className={styles.glyphIcon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6.5C4 5.67157 4.67157 5 5.5 5H18.5C19.3284 5 20 5.67157 20 6.5V17.5C20 18.3284 19.3284 19 18.5 19H5.5C4.67157 19 4 18.3284 4 17.5V6.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 6.5L12 12.5L19.5 6.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showWordmark ? <span className={styles.wordmark}>Inbox Assistant</span> : null}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={styles.link}>
        {content}
      </Link>
    );
  }

  return content;
}
