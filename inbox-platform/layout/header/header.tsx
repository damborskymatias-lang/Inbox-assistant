import React from 'react';
import classNames from 'classnames';
import { Logo } from '@lov/design.content.logo';
import { IconButton } from '@lov/design.actions.icon-button';
import { UserBar, type UserBarMenuItem } from '@lov/inbox-platform.composites.user-bar';
import { MenuIcon } from '@lov/inbox-platform.icons.inbox-icons';
import type { User } from '@lov/inbox-platform.entities.user';
import type { HeaderAction } from './header-action-type.js';
import styles from './header.module.scss';

const DEFAULT_HEADER_ACTIONS: HeaderAction[] = [];
const DEFAULT_USER_BAR_MENU_ITEMS: UserBarMenuItem[] = [];

export type HeaderProps = {
  /**
   * header actions registered by feature aspects, rendered between the logo and the user bar.
   */
  headerActions?: HeaderAction[];

  /**
   * user-bar menu items registered by feature aspects, rendered in the user bar dropdown.
   */
  userBarMenuItems?: UserBarMenuItem[];

  /**
   * called when the hamburger icon-button is clicked, below the 1024px breakpoint.
   */
  onToggleSidebar?: () => void;

  /**
   * mock user to bypass the current user network request, useful for tests and compositions.
   */
  mockUser?: User;

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
 * sticky app header with the logo on the left, registered header actions in
 * the middle/right and the user bar on the far right. shows a hamburger
 * icon-button below 1024px to toggle the sidebar.
 */
export function Header({
  headerActions = DEFAULT_HEADER_ACTIONS,
  userBarMenuItems = DEFAULT_USER_BAR_MENU_ITEMS,
  onToggleSidebar,
  mockUser,
  className,
  style,
}: HeaderProps) {
  const sortedActions = [...headerActions].sort((a, b) => (a.weight || 0) - (b.weight || 0));

  return (
    <header className={classNames(styles.header, className)} style={style}>
      <div className={styles.left}>
        <IconButton
          icon={<MenuIcon size="sm" />}
          label="Toggle sidebar"
          variant="ghost"
          size="md"
          className={styles.menuButton}
          onClick={() => onToggleSidebar?.()}
        />
        <Logo size="md" href="/dashboard" className={styles.logo} />
      </div>
      <div className={styles.right}>
        {sortedActions.length > 0 ? (
          <div className={styles.actions}>
            {sortedActions.map((action) => {
              const ActionComponent = action.component;
              return <ActionComponent key={action.name} />;
            })}
          </div>
        ) : null}
        <UserBar menuItems={userBarMenuItems} mockUser={mockUser} />
      </div>
    </header>
  );
}
