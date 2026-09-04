import React from 'react';
import classNames from 'classnames';
import styles from './skeleton.module.scss';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

export type SkeletonProps = {
  /**
   * shape of the skeleton placeholder.
   */
  variant?: SkeletonVariant;

  /**
   * width of the skeleton, accepts any css width value (e.g. `120px`, `40%`).
   */
  width?: string | number;

  /**
   * height of the skeleton, accepts any css height value (e.g. `16px`, `2rem`).
   */
  height?: string | number;

  /**
   * number of text lines to render when the variant is `text`.
   */
  lines?: number;

  /**
   * class name to override the root element.
   */
  className?: string;

  /**
   * style object, used only to pass computed sizing to the skeleton.
   */
  style?: React.CSSProperties;
};

const DEFAULT_HEIGHT: Record<SkeletonVariant, string> = {
  text: '0.9rem',
  rect: '120px',
  circle: '40px',
};

function resolveSize(value?: string | number) {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * A shimmering placeholder used while content is loading.
 */
export function Skeleton({ variant = 'text', width, height, lines = 1, className, style }: SkeletonProps) {
  const resolvedWidth = resolveSize(width);
  const resolvedHeight = resolveSize(height) || DEFAULT_HEIGHT[variant];

  if (variant === 'text' && lines > 1) {
    const lineIndexes = Array.from({ length: lines }, (_, index) => index);
    return (
      <span className={classNames(styles.textGroup, className)} style={style}>
        {lineIndexes.map((index) => (
          <span
            key={index}
            className={classNames(styles.skeleton, styles.text)}
            style={{
              width: index === lineIndexes.length - 1 ? resolvedWidth || '60%' : resolvedWidth || '100%',
              height: resolvedHeight,
            }}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      className={classNames(styles.skeleton, styles[variant], className)}
      style={{
        width: resolvedWidth || (variant === 'circle' ? resolvedHeight : '100%'),
        height: resolvedHeight,
      }}
    />
  );
}
