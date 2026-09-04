import React from 'react';
import classNames from 'classnames';
import { Heading } from '@lov/design.typography.heading';
import { Paragraph } from '@lov/design.typography.paragraph';
import { Button } from '@lov/design.actions.button';
import styles from './empty-state.module.scss';

export type EmptyStateProps = {
  /**
   * an icon or emoji rendered above the title.
   */
  icon?: React.ReactNode;

  /**
   * the main message describing the empty state.
   */
  title?: string;

  /**
   * supporting text explaining the empty state or the next step.
   */
  description?: string;

  /**
   * label for the optional action button, rendered when provided.
   */
  actionLabel?: string;

  /**
   * called when the action button is clicked.
   */
  onAction?: () => void;

  /**
   * a class name to override the empty state styles.
   */
  className?: string;

  /**
   * style for layout and positioning purposes.
   */
  style?: React.CSSProperties;
};

/**
 * a centered empty state used for inbox zero, no cleanup suggestions and no email selected.
 */
export function EmptyState({
  icon = `📭`,
  title = `Nothing here yet`,
  description = `There is nothing to show right now.`,
  actionLabel,
  onAction,
  className,
  style,
}: EmptyStateProps) {
  return (
    <div className={classNames(styles.emptyState, className)} style={style}>
      <div className={styles.icon}>{icon}</div>
      <Heading level={3} size="sm" className={styles.title}>
        {title}
      </Heading>
      <Paragraph size="sm" tone="soft" className={styles.description}>
        {description}
      </Paragraph>
      {actionLabel && (
        <div className={styles.action}>
          <Button variant="primary" size="sm" onClick={() => onAction?.()}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
