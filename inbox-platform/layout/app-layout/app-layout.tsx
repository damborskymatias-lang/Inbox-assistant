import React, { useState, type ReactNode } from 'react';
import classNames from 'classnames';
import { useAuth } from '@lov/inbox-platform.hooks.use-auth';
import { User } from '@lov/inbox-platform.entities.user';
import { Header, type HeaderProps, type HeaderAction } from '@lov/inbox-platform.layout.header';
import { Sidebar, type NavigationItem } from '@lov/inbox-platform.layout.sidebar';
import { Spinner } from '@lov/design.loaders.spinner';
import styles from './app-layout.module.scss';

export type AppLayoutProps = {
  /**
   * navigation items registered by feature aspects, rendered in the sidebar sorted by weight.
   */
  navigationItems?: NavigationItem[];

  /**
   * header actions registered by feature aspects, rendered between the logo and the user bar.
   */
  headerActions?: HeaderAction[];

  /**
   * user-bar menu items registered by feature aspects, rendered in the user dropdown menu.
   */
  userBarMenuItems?: HeaderProps['userBarMenuItems'];

  /**
   * mock authenticated user to bypass the network request, useful for tests and compositions.
   */
  mockUser?: User;

  /**
   * page content rendered inside the layout.
   */
  children?: ReactNode;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style tags to include.
   */
  style?: React.CSSProperties;
};

/**
 * Global layout wrapper registered by the platform aspect. Composes the header, sidebar
 * and content area, showing the sidebar only for authenticated users while anonymous
 * visitors get the header and content only. Renders a full-page spinner while the
 * authenticated user is being resolved.
 */
export function AppLayout({
  navigationItems,
  headerActions,
  userBarMenuItems,
  mockUser,
  children,
  className,
  style,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading, isAuthenticated } = useAuth({ mockData: mockUser });

  if (loading) {
    return (
      <div className={classNames(styles.loadingScreen, className)} style={style}>
        <Spinner size="lg" label="Loading your workspace…" />
      </div>
    );
  }

  return (
    <div className={classNames(styles.layout, className)} style={style}>
      <Header
        headerActions={headerActions}
        userBarMenuItems={userBarMenuItems}
        onToggleSidebar={isAuthenticated ? () => setSidebarOpen((open) => !open) : undefined}
      />
      <div className={styles.body}>
        {isAuthenticated && (
          <Sidebar
            navigationItems={navigationItems}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
