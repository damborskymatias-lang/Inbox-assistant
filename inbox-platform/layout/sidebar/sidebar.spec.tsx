import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomeIcon, SettingsIcon } from '@lov/inbox-platform.icons.inbox-icons';
import { Sidebar } from './sidebar.js';
import type { NavigationItem } from './navigation-item-type.js';
import styles from './sidebar.module.scss';

const NAV_ITEMS: NavigationItem[] = [
  { label: `Settings`, href: `/settings`, icon: SettingsIcon, weight: 2 },
  { label: `Dashboard`, href: `/dashboard`, icon: HomeIcon, weight: 0, badge: () => 5 },
];

describe(`Sidebar`, () => {
  it(`renders navigation items sorted by weight`, () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar navigationItems={NAV_ITEMS} />
      </MemoryRouter>
    );

    const items = container.querySelectorAll(`.${styles.navItem}`);
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain(`Dashboard`);
    expect(items[1].textContent).toContain(`Settings`);
  });

  it(`marks the item matching the current route as active`, () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/settings']}>
        <Sidebar navigationItems={NAV_ITEMS} />
      </MemoryRouter>
    );

    const activeLink = container.querySelector(`.${styles.navLinkActive}`);
    expect(activeLink?.textContent).toContain(`Settings`);
  });

  it(`renders a badge when the item provides a count`, () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar navigationItems={NAV_ITEMS} />
      </MemoryRouter>
    );

    const badge = container.querySelector(`.${styles.navBadge}`);
    expect(badge?.textContent).toContain(`5`);
  });

  it(`shows an empty state when no navigation items are provided`, () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar navigationItems={[]} />
      </MemoryRouter>
    );

    const empty = container.querySelector(`.${styles.empty}`);
    expect(empty).toBeTruthy();
  });

  it(`calls onClose when the backdrop is clicked`, () => {
    const onClose = vi.fn();

    const { container } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar navigationItems={NAV_ITEMS} open onClose={onClose} />
      </MemoryRouter>
    );

    const backdrop = container.querySelector(`.${styles.backdrop}`);
    if (backdrop) fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalled();
  });
});
