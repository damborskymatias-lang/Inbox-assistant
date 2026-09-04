import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { ClockIcon, SettingsIcon, DashboardIcon } from '@lov/inbox-platform.icons.inbox-icons';
import type { UserBarMenuItem } from '@lov/inbox-platform.composites.user-bar';
import { Header } from './header.js';
import type { HeaderAction } from './header-action-type.js';

function MinutesSavedIndicator() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '999px',
        backgroundColor: 'var(--colors-status-positive-subtle)',
        color: 'var(--colors-status-positive-default)',
        fontSize: 'var(--typography-sizes-caption-default)',
        fontWeight: 'var(--typography-font-weight-semi-bold)',
      }}
    >
      <ClockIcon size="sm" />
      You saved ~24 minutes today
    </span>
  );
}

const headerActions: HeaderAction[] = [{ name: `minutes-saved`, component: MinutesSavedIndicator, weight: 1 }];

const userBarMenuItems: UserBarMenuItem[] = [
  { label: `Profile settings`, href: `/settings/profile`, icon: SettingsIcon, weight: 1 },
  { label: `Workspace`, href: `/settings/workspace`, icon: DashboardIcon, weight: 2 },
];

export const HeaderWithActions = () => {
  return (
    <MockProvider>
      <Header headerActions={headerActions} userBarMenuItems={userBarMenuItems} mockUser={mockUser()} />
    </MockProvider>
  );
};

export const HeaderWithSidebarToggle = () => {
  return (
    <MockProvider>
      <Header
        headerActions={headerActions}
        userBarMenuItems={userBarMenuItems}
        mockUser={mockUser()}
        onToggleSidebar={() => undefined}
      />
    </MockProvider>
  );
};

export const AnonymousHeader = () => {
  return (
    <MockProvider>
      <Header headerActions={headerActions} userBarMenuItems={userBarMenuItems} />
    </MockProvider>
  );
};
