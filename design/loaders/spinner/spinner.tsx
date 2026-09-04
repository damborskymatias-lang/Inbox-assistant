import React from 'react';
import classNames from 'classnames';
import type { SpinnerSize } from './spinner-size-type.js';
import styles from './spinner.module.scss';

export type SpinnerProps = {
  /**
   * size of the spinner.
   */
  size?: SpinnerSize;

  /**
   * optional label to render next to the spinner.
   */
  label?: string;

  /**
   * class name for the wrapper element.
   */
  className?: string;

  /**
   * style tags to include.
   */
  style?: React.CSSProperties;
};

/**
 * a simple loading spinner with configurable sizes and an optional label.
 */
export function Spinner({ size = 'md', label, className, style }: SpinnerProps) {
  const sizeClass = styles[size];

  return (
    <div className={classNames(styles.wrapper, className)} style={style}>
      <span className={classNames(styles.spinner, sizeClass)} />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}

export type DraftingIndicatorProps = {
  /**
   * label rendered next to the pulsing dots.
   */
  label?: string;

  /**
   * class name for the wrapper element.
   */
  className?: string;

  /**
   * style tags to include.
   */
  style?: React.CSSProperties;
};

/**
 * a subtle three-dot pulsing indicator used while the AI drafts a reply.
 */
export function DraftingIndicator({
  label = `Drafting a reply in your writing style…`,
  className,
  style,
}: DraftingIndicatorProps) {
  return (
    <div className={classNames(styles.draftingWrapper, className)} style={style}>
      <span className={styles.dots}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </span>
      <span className={styles.draftingLabel}>{label}</span>
    </div>
  );
}
