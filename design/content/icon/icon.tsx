import React from 'react';
import classNames from 'classnames';
import styles from './icon.module.scss';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | number;

const SIZE_MAP: Record<string, number> = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
};

const COLOR_TOKEN_MAP: Record<string, string> = {
  primary: 'var(--colors-primary-default)',
  secondary: 'var(--colors-secondary-default)',
  default: 'var(--colors-text-default)',
  inherit: 'currentColor',
  muted: 'var(--colors-text-muted)',
  inverse: 'var(--colors-text-inverse)',
  positive: 'var(--colors-status-positive-default)',
  negative: 'var(--colors-status-negative-default)',
  warning: 'var(--colors-status-warning-default)',
  info: 'var(--colors-status-info-default)',
  urgent: 'var(--colors-triage-urgent-default)',
  needsReply: 'var(--colors-triage-needs-reply-default)',
  fyi: 'var(--colors-triage-fyi-default)',
  promotions: 'var(--colors-triage-promotions-default)',
};

function resolveSize(size: IconSize) {
  if (typeof size === 'number') return size;
  return SIZE_MAP[size] || SIZE_MAP.md;
}

function resolveColor(color: string) {
  return COLOR_TOKEN_MAP[color] || color;
}

export type IconProps = {
  /**
   * the SVG path elements that make up the icon graphic.
   */
  children?: React.ReactNode;

  /**
   * size of the icon, either a preset (xs, sm, md, lg) or a number of pixels.
   */
  size?: IconSize;

  /**
   * color of the icon, either a theme color token name or a CSS color value.
   */
  color?: string;

  /**
   * accessible title for the icon. when omitted the icon is hidden from assistive tech.
   */
  title?: string;

  /**
   * class name to override the icon container.
   */
  className?: string;

  /**
   * style to override the icon container.
   */
  style?: React.CSSProperties;
};

/**
 * Base SVG icon wrapper used to build every icon in the scope's icon sets,
 * keeping sizing and coloring consistent across the design system.
 */
export function Icon({ children, size = 'md', color = 'default', title, className, style }: IconProps) {
  const resolvedSize = resolveSize(size);
  const resolvedColor = resolveColor(color);
  const iconStyle = {
    ...style,
    '--icon-size': `${resolvedSize}px`,
    '--icon-color': resolvedColor,
  } as React.CSSProperties;

  return (
    <svg
      className={classNames(styles.icon, className)}
      style={iconStyle}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : 'presentation'}
      aria-hidden={!title}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}
