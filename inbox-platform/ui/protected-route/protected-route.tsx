import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useAuth } from '@lov/inbox-platform.hooks.use-auth';
import { type User } from '@lov/inbox-platform.entities.user';
import { Spinner } from '@lov/design.loaders.spinner';
import styles from './protected-route.module.scss';

export type ProtectedRouteProps = {
  /**
   * path to redirect anonymous users to.
   */
  redirectTo?: string;

  /**
   * the protected content, rendered only for authenticated users.
   */
  children?: React.ReactNode;

  /**
   * class name for the wrapper element.
   */
  className?: string;

  /**
   * style tags to include.
   */
  style?: React.CSSProperties;

  /**
   * mock user to bypass the auth network request, useful for tests and compositions.
   */
  mockUser?: User;
};

/**
 * a route guard that renders its children only for authenticated users.
 * shows a centered spinner while the auth state resolves and redirects
 * anonymous users to the login route, preserving the attempted path.
 */
export function ProtectedRoute({
  redirectTo = `/login`,
  children,
  className,
  style,
  mockUser,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { loading, isAuthenticated } = useAuth({ mockData: mockUser });

  if (loading) {
    return (
      <div className={classNames(styles.loadingScreen, className)} style={style}>
        <Spinner size="lg" label="Checking your session…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: `${location.pathname}${location.search}` }}
        replace
      />
    );
  }

  return <>{children}</>;
}
