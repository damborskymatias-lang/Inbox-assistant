import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { SettingsIcon, DashboardIcon } from '@lov/inbox-platform.icons.inbox-icons';
import { UserBar } from './user-bar.js';
import type { UserBarMenuItem } from './user-bar-menu-item-type.js';

const menuItems: UserBarMenuItem[] = [
  { label: `Profile settings`, href: `/settings/profile`, icon: SettingsIcon, weight: 1 },
  { label: `Workspace`, href: `/settings/workspace`, icon: DashboardIcon, weight: 2 },
];

export const SignedInUserBar = () => {
  return (
    <MockProvider>
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <UserBar mockUser={mockUser()} menuItems={menuItems} />
      </div>
    </MockProvider>
  );
};

export const SignedInWithoutMenuItems = () => {
  return (
    <MockProvider>
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <UserBar mockUser={mockUser()} />
      </div>
    </MockProvider>
  );
};

export const AnonymousUserBar = () => {
  return (
    <MockProvider>
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <UserBar />
      </div>
    </MockProvider>
  );
};
