import React from 'react';
import classNames from 'classnames';
import { Skeleton } from './skeleton.js';
import styles from './skeleton-list.module.scss';

export type SkeletonListVariant = 'email' | 'panel';

export type SkeletonListProps = {
  /**
   * layout to render, matching the loading state of an email list or a dashboard panel grid.
   */
  variant?: SkeletonListVariant;

  /**
   * number of placeholder rows or tiles to render.
   */
  count?: number;

  /**
   * class name to override the root element.
   */
  className?: string;

  /**
   * style object, used only to pass computed sizing to the skeleton list.
   */
  style?: React.CSSProperties;
};

const DEFAULT_COUNT: Record<SkeletonListVariant, number> = {
  email: 4,
  panel: 4,
};

function EmailRowSkeleton() {
  return (
    <div className={styles.emailRow}>
      <Skeleton variant="rect" width={6} height="100%" className={styles.stripe} />
      <div className={styles.emailContent}>
        <Skeleton variant="text" width="35%" />
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="90%" />
      </div>
      <div className={styles.emailMeta}>
        <Skeleton variant="text" width="48px" />
        <Skeleton variant="rect" width="64px" height="18px" />
      </div>
    </div>
  );
}

function PanelTileSkeleton() {
  return (
    <div className={styles.panelTile}>
      <Skeleton variant="text" width="30%" height="1.6rem" />
      <Skeleton variant="text" width="60%" />
    </div>
  );
}

/**
 * A ready-made collection of skeleton placeholders for loading email rows
 * or dashboard summary panels.
 */
export function SkeletonList({ variant = 'email', count, className, style }: SkeletonListProps) {
  const resolvedCount = count || DEFAULT_COUNT[variant];
  const items = Array.from({ length: resolvedCount }, (_, index) => index);

  if (variant === 'panel') {
    return (
      <div className={classNames(styles.panelGrid, className)} style={style}>
        {items.map((index) => (
          <PanelTileSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={classNames(styles.emailList, className)} style={style}>
      {items.map((index) => (
        <EmailRowSkeleton key={index} />
      ))}
    </div>
  );
}
