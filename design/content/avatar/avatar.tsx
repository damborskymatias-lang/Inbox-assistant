import React from 'react';
import classNames from 'classnames';
import styles from './avatar.module.scss';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

export type AvatarProps = {
  /**
   * image url to display inside the avatar.
   */
  src?: string;

  /**
   * name used to derive initials and the deterministic
   * background color when no image is available.
   */
  name?: string;

  /**
   * size of the avatar.
   */
  size?: AvatarSize;

  /**
   * class name for the avatar.
   */
  className?: string;

  /**
   * style for the avatar.
   */
  style?: React.CSSProperties;
};

const PASTEL_PALETTE = [
  '#f3d9e4',
  '#d9e8f5',
  '#dcefdc',
  '#f6e6c9',
  '#e5dcf5',
  '#d9f0ec',
  '#f5dcd4',
  '#e0e5f5',
];

/**
 * derives initials from a display name.
 * uses the first letter of the first two words, falling back to a single letter.
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

/**
 * derives a deterministic pastel color from a name so the same
 * name always renders with the same background color.
 */
function getPastelColor(name: string): string {
  let hash = 0;
  for (const char of name) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PASTEL_PALETTE.length;
  return PASTEL_PALETTE[index];
}

/**
 * circular avatar rendering a user image, or initials with a deterministic
 * pastel background when no image is available.
 */
export function Avatar({ src, name = `Unknown User`, size = `md`, className, style }: AvatarProps) {
  const initials = getInitials(name);
  const backgroundColor = getPastelColor(name);

  return (
    <span
      className={classNames(styles.avatar, styles[size], className)}
      style={src ? style : { ...style, backgroundColor }}
      title={name}
    >
      {src ? (
        <img className={styles.image} src={src} alt={name} />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
    </span>
  );
}
