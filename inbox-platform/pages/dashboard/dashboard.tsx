import React from 'react';
import classNames from 'classnames';
import { ProtectedRoute } from '@lov/inbox-platform.ui.protected-route';
import { useAuth } from '@lov/inbox-platform.hooks.use-auth';
import { type User } from '@lov/inbox-platform.entities.user';
import { PageLayout } from '@lov/design.layouts.page-layout';
import { EmptyState } from '@lov/design.content.empty-state';
import type { DashboardPanel } from './dashboard-panel-type.js';
import styles from './dashboard.module.scss';

export type DashboardProps = {
  /**
   * dashboard panels contributed by features via the dashboard panels slot.
   */
  panels?: DashboardPanel[];

  /**
   * mock user bypassing the auth network request, useful for tests and compositions.
   */
  mockUser?: User;

  /**
   * path anonymous visitors are redirected to.
   */
  redirectTo?: string;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style property for spacing and positioning overrides.
   */
  style?: React.CSSProperties;
};

const defaultPanels: DashboardPanel[] = [];

/**
 * the authenticated dashboard page. Greets the signed-in user and renders every panel
 * registered by feature aspects via the dashboard panels slot, sorted by weight and
 * laid out in a responsive grid honoring each panel's span.
 */
export function Dashboard({
  panels = defaultPanels,
  mockUser,
  redirectTo = `/login`,
  className,
  style,
}: DashboardProps) {
  const { user } = useAuth({ mockData: mockUser });
  const firstName = user?.name?.trim().split(' ')[0] || `there`;
  const sortedPanels = [...panels].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));

  return (
    <ProtectedRoute mockUser={mockUser} redirectTo={redirectTo}>
      <div className={classNames(styles.dashboard, className)} style={style}>
        <PageLayout
          title={`Good morning, ${firstName} 👋`}
          subtitle="Here's what's happening across your inbox today."
        >
          {sortedPanels.length === 0 ? (
            <EmptyState
              icon="📊"
              title="No panels yet"
              description="Panels contributed by features will show up here once they're registered."
            />
          ) : (
            <div className={styles.grid}>
              {sortedPanels.map((panel) => {
                const PanelComponent = panel.component;
                return (
                  <div
                    key={panel.name}
                    className={classNames(
                      styles.panel,
                      panel.span === `full` ? styles.spanFull : styles.spanHalf
                    )}
                  >
                    <PanelComponent />
                  </div>
                );
              })}
            </div>
          )}
        </PageLayout>
      </div>
    </ProtectedRoute>
  );
}
