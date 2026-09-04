import React, { type ReactNode } from 'react';
import classNames from 'classnames';
import { Heading } from '@lov/design.typography.heading';
import { Paragraph } from '@lov/design.typography.paragraph';
import styles from './page-layout.module.scss';

export type PageLayoutProps = {
  /**
   * the page title, rendered as the primary heading.
   */
  title?: string;

  /**
   * a short supporting line rendered under the title.
   */
  subtitle?: string;

  /**
   * actions rendered in the top-right corner of the page header, for example buttons.
   */
  actions?: ReactNode;

  /**
   * maximum width of the page content, matching the app main area by default.
   */
  maxWidth?: string;

  /**
   * the page content rendered below the header.
   */
  children?: ReactNode;

  /**
   * class name to override the root container style.
   */
  className?: string;

  /**
   * style for the root container.
   */
  style?: React.CSSProperties;
};

/**
 * PageLayout renders the inner content area of a page, with a consistent max-width, page
 * padding and an optional header row for a title, subtitle and top-right actions. It does not
 * include a header, sidebar or footer.
 */
export function PageLayout({
  title,
  subtitle,
  actions,
  maxWidth = `1240px`,
  children,
  className,
  style,
}: PageLayoutProps) {
  const hasHeader = Boolean(title || subtitle || actions);
  const containerStyle = {
    ...style,
    '--page-max-width': maxWidth,
  } as React.CSSProperties;

  return (
    <div className={classNames(styles.page, className)} style={containerStyle}>
      {hasHeader && (
        <div className={styles.header}>
          <div className={styles.headerText}>
            {title && <Heading level={1}>{title}</Heading>}
            {subtitle && (
              <Paragraph size="md" tone="soft">
                {subtitle}
              </Paragraph>
            )}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
