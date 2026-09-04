import React from 'react';
import classNames from 'classnames';
import { useAuth } from '@lov/inbox-platform.hooks.use-auth';
import type { User } from '@lov/inbox-platform.entities.user';
import { Hero } from '@lov/inbox-platform.sections.hero';
import { FeaturesSection } from '@lov/inbox-platform.sections.features-section';
import { Dashboard, type DashboardPanel } from '@lov/inbox-platform.pages.dashboard';
import styles from './home.module.scss';

export type HomeProps = {
  /**
   * mock user bypassing the auth network request, useful for tests and compositions.
   */
  mockUser?: User;

  /**
   * dashboard panels contributed by feature aspects via the dashboard panels slot,
   * rendered in the dashboard for authenticated users.
   */
  dashboardPanels?: DashboardPanel[];

  /**
   * called when the marketing hero's primary call to action is clicked.
   */
  onGetStarted?: () => void;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

const defaultDashboardPanels: DashboardPanel[] = [];

/**
 * Root route (/) of the platform. Shows a spinner while auth resolves, renders the
 * marketing homepage (hero + features) for anonymous visitors, and the dashboard
 * page for authenticated users.
 */
export function Home({
  mockUser,
  dashboardPanels = defaultDashboardPanels,
  onGetStarted,
  className,
  style,
}: HomeProps) {
  const { isAuthenticated, loading } = useAuth({ mockData: mockUser });

  if (loading) {
    return (
      <div className={classNames(styles.loadingScreen, className)} style={style}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className={classNames(styles.home, className)} style={style}>
        <Dashboard mockUser={mockUser} panels={dashboardPanels} />
      </div>
    );
  }

  return (
    <div className={classNames(styles.home, className)} style={style}>
      <Hero onCtaClick={() => onGetStarted?.()} />
      <FeaturesSection />
    </div>
  );
}
