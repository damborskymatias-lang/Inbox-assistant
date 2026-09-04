import React from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Heading } from '@lov/design.typography.heading';
import { EmptyState } from '@lov/design.content.empty-state';
import { Button } from '@lov/design.actions.button';
import styles from './not-found-page.module.scss';

export type NotFoundPageProps = {
  /**
   * path the "Back to dashboard" button navigates to.
   */
  dashboardPath?: string;

  /**
   * class name to override the root container.
   */
  className?: string;

  /**
   * style for layout and positioning purposes.
   */
  style?: React.CSSProperties;
};

/**
 * 404 page shown for unmatched routes. Displays an empty state with a short
 * message explaining the page could not be found, and a button back to the dashboard.
 */
export function NotFoundPage({
  dashboardPath = `/dashboard`,
  className,
  style,
}: NotFoundPageProps) {
  const navigate = useNavigate();

  return (
    <div className={classNames(styles.page, className)} style={style}>
      <div className={styles.content}>
        <Heading level={1} size="xl" className={styles.code}>
          404
        </Heading>
        <EmptyState
          icon="🧭"
          title="Page not found"
          description="The page you're looking for doesn't exist or may have been moved."
          className={styles.emptyState}
        />
        <Button
          variant="primary"
          size="lg"
          className={styles.action}
          onClick={() => navigate(dashboardPath)}
        >
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
