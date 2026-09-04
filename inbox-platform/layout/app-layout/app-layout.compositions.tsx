import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { InboxTheme } from '@lov/design.inbox-theme';
import { mockUser } from '@lov/inbox-platform.entities.user';
import type { NavigationItem } from '@lov/inbox-platform.layout.sidebar';
import type { HeaderAction } from '@lov/inbox-platform.layout.header';
import { AppLayout } from './app-layout.js';

const navigationItems: NavigationItem[] = [
  { label: `Dashboard`, href: `/dashboard`, weight: 0 },
  { label: `Inbox`, href: `/inbox`, weight: 1, badge: () => 12 },
  { label: `Settings`, href: `/settings`, weight: 2 },
];

function MinutesSavedIndicator() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: '0.8rem',
        color: '#116b3c',
        background: '#ecfdf3',
        border: '1px solid #c6f0d6',
        padding: '0.35rem 0.6rem',
        borderRadius: '999px',
        whiteSpace: 'nowrap',
      }}
    >
      ⏱ You saved ~24 minutes today
    </span>
  );
}

const headerActions: HeaderAction[] = [{ name: `minutes-saved`, component: MinutesSavedIndicator, weight: 0 }];

export const AuthenticatedLayout = () => {
  return (
    <MemoryRouter initialEntries={['/dashboard']}>
      <InboxTheme>
        <AppLayout navigationItems={navigationItems} headerActions={headerActions} mockUser={mockUser()}>
          <div style={{ padding: '1.5rem' }}>
            <h2>Welcome back, Peter</h2>
            <p>Your triaged inbox and daily summary render here.</p>
          </div>
        </AppLayout>
      </InboxTheme>
    </MemoryRouter>
  );
};

export const AnonymousLayout = () => {
  return (
    <MemoryRouter initialEntries={['/']}>
      <InboxTheme>
        <AppLayout headerActions={headerActions}>
          <div style={{ padding: '1.5rem' }}>
            <h2>Sign in to continue</h2>
            <p>Anonymous visitors only see the header and page content, no sidebar.</p>
          </div>
        </AppLayout>
      </InboxTheme>
    </MemoryRouter>
  );
};

export const LayoutWithLongContent = () => {
  return (
    <MemoryRouter initialEntries={['/inbox']}>
      <InboxTheme>
        <AppLayout navigationItems={navigationItems} mockUser={mockUser()}>
          <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={`row-${index}`}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--borders-default-color)',
                  borderRadius: 'var(--borders-radius-medium)',
                }}
              >
                Email row {index + 1}
              </div>
            ))}
          </div>
        </AppLayout>
      </InboxTheme>
    </MemoryRouter>
  );
};
