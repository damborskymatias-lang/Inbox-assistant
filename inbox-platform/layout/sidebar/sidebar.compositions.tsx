import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardIcon, HomeIcon, SettingsIcon } from '@lov/inbox-platform.icons.inbox-icons';
import { Sidebar } from './sidebar.js';
import type { NavigationItem } from './navigation-item-type.js';

const NAV_ITEMS: NavigationItem[] = [
  { label: `Dashboard`, href: `/dashboard`, icon: HomeIcon, weight: 0 },
  { label: `Inbox`, href: `/inbox`, icon: DashboardIcon, weight: 1, badge: () => 12 },
  { label: `Settings`, href: `/settings`, icon: SettingsIcon, weight: 2 },
];

export const BasicSidebar = () => {
  return (
    <MemoryRouter initialEntries={['/dashboard']}>
      <div style={{ display: 'flex', height: '480px' }}>
        <Sidebar navigationItems={NAV_ITEMS} open />
      </div>
    </MemoryRouter>
  );
};

export const ActiveRouteHighlighted = () => {
  return (
    <MemoryRouter initialEntries={['/inbox']}>
      <div style={{ display: 'flex', height: '480px' }}>
        <Sidebar navigationItems={NAV_ITEMS} open />
      </div>
    </MemoryRouter>
  );
};

export const InteractiveDrawer = () => {
  const [open, setOpen] = useState(true);

  return (
    <MemoryRouter initialEntries={['/dashboard']}>
      <div style={{ position: 'relative', height: '480px' }}>
        <button onClick={() => setOpen((value) => !value)}>Toggle drawer</button>
        <Sidebar navigationItems={NAV_ITEMS} open={open} onClose={() => setOpen(false)} />
      </div>
    </MemoryRouter>
  );
};

export const EmptyNavigation = () => {
  return (
    <MemoryRouter initialEntries={['/dashboard']}>
      <div style={{ display: 'flex', height: '480px' }}>
        <Sidebar navigationItems={[]} open />
      </div>
    </MemoryRouter>
  );
};
