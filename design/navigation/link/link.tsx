import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';
import styles from './link.module.scss';

export type LinkProps = {
  /**
   * the destination the link points to.
   */
  href?: string;

  /**
   * whether the link points to an external resource.
   * when true, renders a native anchor with rel="noopener".
   */
  external?: boolean;

  /**
   * marks the link as the currently active navigation item.
   * uses the brand color to indicate the active state.
   */
  active?: boolean;

  /**
   * whether to underline the link text.
   */
  underline?: boolean;

  /**
   * the content rendered inside the link.
   */
  children?: React.ReactNode;

  /**
   * class name to override the link styles.
   */
  className?: string;

  /**
   * style object for layout and positioning purposes.
   */
  style?: React.CSSProperties;
};

/**
 * a link component that renders a react-router Link for internal hrefs
 * and a native anchor with rel="noopener" for external ones.
 */
export function Link({
  href = `/`,
  external = false,
  active = false,
  underline = false,
  children,
  className,
  style,
}: LinkProps) {
  const linkClassName = classNames(
    styles.link,
    active && styles.active,
    underline && styles.underline,
    className
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
        style={style}
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={href} className={linkClassName} style={style}>
      {children}
    </RouterLink>
  );
}
