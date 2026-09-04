import React, { useState } from 'react';
import classNames from 'classnames';
import { Avatar } from '@lov/design.content.avatar';
import { Dropdown } from '@lov/design.overlays.dropdown';
import { Button } from '@lov/design.actions.button';
import { Link } from '@lov/design.navigation.link';
import { useAuth } from '@lov/inbox-platform.hooks.use-auth';
import { type User } from '@lov/inbox-platform.entities.user';
import { ChevronDownIcon, GoogleIcon, LogoutIcon } from '@lov/inbox-platform.icons.inbox-icons';
import type { UserBarMenuItem } from './user-bar-menu-item-type.js';
import styles from './user-bar.module.scss';

const DEFAULT_MENU_ITEMS: UserBarMenuItem[] = [];

export type UserBarProps = {
  /**
   * user-bar menu items registered by feature aspects, rendered above sign out.
   */
  menuItems?: UserBarMenuItem[];

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
 * signed-in user control for the header. shows an avatar, name and a dropdown
 * with registered user-bar menu items plus sign out. renders a
 * "Continue with Google" button for anonymous visitors.
 */
export function UserBar({
  menuItems = DEFAULT_MENU_ITEMS,
  mockUser,
  className,
  style,
}: UserBarProps) {
  const [open, setOpen] = useState(false);
  const { user, loading, isAuthenticated, loginWithGoogle, logout } = useAuth({
    mockData: mockUser,
  });

  const sortedMenuItems = [...menuItems].sort((a, b) => (a.weight || 0) - (b.weight || 0));

  const handleSignOut = () => {
    setOpen(false);
    logout();
  };

  if (loading) {
    return <div className={classNames(styles.userBar, className)} style={style} />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={classNames(styles.userBar, className)} style={style}>
        <Button
          variant="primary"
          size="sm"
          iconStart={<GoogleIcon size="sm" />}
          onClick={() => loginWithGoogle()}
        >
          Continue with Google
        </Button>
      </div>
    );
  }

  return (
    <div className={classNames(styles.userBar, className)} style={style}>
      <Dropdown
        placement="bottom-end"
        open={open}
        onOpenChange={(nextOpen) => setOpen(nextOpen)}
        trigger={
          <div className={styles.trigger}>
            <Avatar name={user.name} src={user.avatarUrl} size="sm" />
            <span className={styles.name}>{user.name}</span>
            <span className={styles.chevron}>
              <ChevronDownIcon size="sm" />
            </span>
          </div>
        }
      >
        <div className={styles.menuHeader}>
          <span className={styles.menuName}>{user.name}</span>
          <span className={styles.menuEmail}>{user.email}</span>
        </div>
        {sortedMenuItems.length > 0 ? (
          <>
            <hr className={styles.divider} />
            <ul className={styles.menuList}>
              {sortedMenuItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <li key={`${item.label}-${item.href}`} className={styles.menuItem}>
                    <Link href={item.href} className={styles.menuLink}>
                      {ItemIcon ? (
                        <span className={styles.icon}>
                          <ItemIcon />
                        </span>
                      ) : null}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}
        <hr className={styles.divider} />
        <button type="button" className={styles.signOutButton} onClick={() => handleSignOut()}>
          <span className={styles.icon}>
            <LogoutIcon size="sm" />
          </span>
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
