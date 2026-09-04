import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { NotFoundPage } from './not-found-page.js';

export const BasicNotFoundPage = () => {
  return (
    <MockProvider initialEntries={['/some/unknown/route']}>
      <NotFoundPage />
    </MockProvider>
  );
};

export const NotFoundWithCustomDashboardPath = () => {
  return (
    <MockProvider initialEntries={['/mailboxes/missing']}>
      <NotFoundPage dashboardPath="/inbox" />
    </MockProvider>
  );
};
