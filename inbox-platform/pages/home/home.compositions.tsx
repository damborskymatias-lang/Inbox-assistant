import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { Home } from './home.js';

export const AnonymousHome = () => {
  return (
    <MockProvider>
      <Home />
    </MockProvider>
  );
};

export const AuthenticatedHome = () => {
  return (
    <MockProvider initialEntries={['/']}>
      <Home mockUser={mockUser()} />
    </MockProvider>
  );
};

export const AuthenticatedHomeWithPanels = () => {
  function DailySummaryPanel() {
    return <div>You have 12 new emails, 3 need a reply today.</div>;
  }

  function CleanupPanel() {
    return <div>42 newsletters ready for cleanup.</div>;
  }

  return (
    <MockProvider initialEntries={['/']}>
      <Home
        mockUser={mockUser({ name: 'Alex Rivera' })}
        dashboardPanels={[
          { name: 'daily-summary', component: DailySummaryPanel, weight: 1, span: 'full' },
          { name: 'cleanup', component: CleanupPanel, weight: 2, span: 'half' },
        ]}
      />
    </MockProvider>
  );
};
