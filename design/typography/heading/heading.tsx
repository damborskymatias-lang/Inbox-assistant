import React, { type ReactNode } from 'react';
import classNames from 'classnames';
import styles from './heading.module.scss';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type HeadingWeight = 'regular' | 'medium' | 'semi-bold' | 'bold';

export type HeadingProps = {
  /**
   * heading level, rendered as the matching h1-h6 element.
   */
  level?: HeadingLevel;

  /**
   * visual size override, independent from the semantic level.
   */
  size?: HeadingSize;

  /**
   * font weight applied to the heading text.
   */
  weight?: HeadingWeight;

  /**
   * content rendered inside the heading.
   */
  children?: ReactNode;

  /**
   * class name to override the heading style.
   */
  className?: string;

  /**
   * style property for spacing and positioning overrides.
   */
  style?: React.CSSProperties;
};

const sizeByLevel: Record<HeadingLevel, HeadingSize> = {
  1: 'xl',
  2: 'lg',
  3: 'md',
  4: 'sm',
  5: 'xs',
  6: 'xs',
};

const sizeClassNames: Record<HeadingSize, string> = {
  xs: styles.xs,
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
};

const weightClassNames: Record<HeadingWeight, string> = {
  regular: styles.weightRegular,
  medium: styles.weightMedium,
  'semi-bold': styles.weightSemiBold,
  bold: styles.weightBold,
};

/**
 * Heading renders a semantic h1-h6 element styled from the theme typography scale.
 * The visual size can be overridden independently from the semantic level, and the
 * font scales down one step on mobile viewports.
 */
export function Heading({
  level = 1,
  size,
  weight = 'bold',
  children,
  className,
  style,
}: HeadingProps) {
  const Component = `h${level}` as keyof React.JSX.IntrinsicElements;
  const resolvedSize = size || sizeByLevel[level];

  return (
    <Component
      className={classNames(
        styles.heading,
        sizeClassNames[resolvedSize],
        weightClassNames[weight],
        className
      )}
      style={style}
    >
      {children}
    </Component>
  );
}
