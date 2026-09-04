import React, { type ReactNode } from 'react';
import classNames from 'classnames';
import styles from './split-layout.module.scss';

export type SplitLayoutProps = {
  /**
   * content rendered in the scrollable list column.
   */
  list?: ReactNode;

  /**
   * content rendered in the detail column.
   */
  detail?: ReactNode;

  /**
   * ratio between the list and the detail column widths on desktop, for example `1.15` renders
   * the list column 1.15 times as wide as the detail column.
   */
  ratio?: number;

  /**
   * keep the detail column pinned to the top of the viewport while the list column scrolls.
   */
  stickyDetail?: boolean;

  /**
   * space between the list and the detail column.
   */
  gap?: string;

  /**
   * whether an item is currently selected. Below 1024px, the detail column only renders as a
   * full-width panel above the list once an item has been selected.
   */
  hasSelection?: boolean;

  /**
   * class name for the root container.
   */
  className?: string;

  /**
   * style for the root container.
   */
  style?: React.CSSProperties;

  /**
   * class name for the list column.
   */
  listClassName?: string;

  /**
   * class name for the detail column.
   */
  detailClassName?: string;
};

export function SplitLayout({
  list,
  detail,
  ratio = 1.15,
  stickyDetail = true,
  gap = `var(--spacing-large)`,
  hasSelection = true,
  className,
  style,
  listClassName,
  detailClassName,
}: SplitLayoutProps) {
  const containerStyle = {
    ...style,
    '--split-gap': gap,
    '--split-list-grow': ratio,
    '--split-detail-grow': 1,
  } as React.CSSProperties;

  const showDetail = Boolean(detail) && hasSelection;

  return (
    <div className={classNames(styles.container, className)} style={containerStyle}>
      <div className={classNames(styles.list, listClassName)}>{list}</div>
      {showDetail && (
        <div
          className={classNames(
            styles.detail,
            stickyDetail && styles.sticky,
            styles.detailPanel,
            detailClassName
          )}
        >
          {detail}
        </div>
      )}
    </div>
  );
}
