import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { Dashboard } from './dashboard.js';
import { mockDashboardPanels } from './dashboard.mock.js';

export const DashboardWithPanels = () => {
  return (
    <MockProvider initialEntries={['/dashboard']}>
      <Dashboard mockUser={mockUser()} panels={mockDashboardPanels} />
    </MockProvider>
  );
};

export const EmptyDashboard = () => {
  return (
    <MockProvider initialEntries={['/dashboard']}>
      <Dashboard mockUser={mockUser()} panels={[]} />
    </MockProvider>
  );
};

export const DashboardForAnotherUser = () => {
  return (
    <MockProvider initialEntries={['/dashboard']}>
      <Dashboard mockUser={mockUser({ name: 'Alex Rivera' })} panels={mockDashboardPanels} />
    </MockProvider>
  );
};
