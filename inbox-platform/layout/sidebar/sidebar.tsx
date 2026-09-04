import React from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Link } from '@lov/design.navigation.link';
import { Badge } from '@lov/design.content.badge';
import type { NavigationItem } from './navigation-item-type.js';
import styles from './sidebar.module.scss';

const DEFAULT_NAVIGATION_ITEMS: NavigationItem[] = [];

export type SidebarProps = {
  /**
   * navigation items registered by feature aspects, rendered sorted by weight.
   */
  navigationItems?: NavigationItem[];

  /**
   * whether the sidebar drawer is open, used below the 1024px breakpoint.
   */
  open?: boolean;

  /**
   * invoked when the drawer should close, e.g. after selecting an item or clicking the backdrop.
   */
  onClose?: () => void;

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
 * Sidebar navigation rendering registered navigation items sorted by weight, each with
 * an icon, label and optional count badge. Highlights the item matching the current
 * route. Renders as a fixed column on desktop and slides in as an overlay drawer below
 * 1024px.
 */
export function Sidebar({
  navigationItems = DEFAULT_NAVIGATION_ITEMS,
  open = false,
  onClose,
  className,
  style,
}: SidebarProps) {
  const location = useLocation();
  const sortedItems = [...navigationItems].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));

  return (
    <React.Fragment>
      <div
        className={classNames(styles.backdrop, open && styles.backdropVisible)}
        onClick={() => onClose?.()}
      />
      <nav
        className={classNames(styles.sidebar, open && styles.sidebarOpen, className)}
        style={style}
      >
        {sortedItems.length === 0 && <div className={styles.empty}>No navigation items yet</div>}
        <ul className={styles.nav}>
          {sortedItems.map((item) => {
            const ItemIcon = item.icon;
            const isActive = location.pathname === item.href;
            const count = item.badge?.();

            return (
              <li key={item.href} className={styles.navItem}>
                <Link
                  href={item.href}
                  active={isActive}
                  className={classNames(styles.navLink, isActive && styles.navLinkActive)}
                >
                  {ItemIcon && (
                    <span className={styles.navIcon}>
                      <ItemIcon size="sm" />
                    </span>
                  )}
                  <span className={styles.navLabel}>{item.label}</span>
                  {count !== undefined && (
                    <span className={styles.navBadge}>
                      <Badge tone="brand" size="xs">
                        {count}
                      </Badge>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </React.Fragment>
  );
}
