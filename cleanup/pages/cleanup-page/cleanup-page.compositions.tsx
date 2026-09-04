import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { mockCleanupSuggestion, mockCleanupSuggestions } from '@lov/cleanup.entities.cleanup-suggestion';
import { CleanupPage } from './cleanup-page.js';

export const CleanupSuggestionsList = () => {
  return (
    <MockProvider initialEntries={['/cleanup']}>
      <CleanupPage mockUser={mockUser()} mockSuggestions={mockCleanupSuggestions()} />
    </MockProvider>
  );
};

export const CleanInboxEmptyState = () => {
  return (
    <MockProvider initialEntries={['/cleanup']}>
      <CleanupPage mockUser={mockUser()} mockSuggestions={[]} />
    </MockProvider>
  );
};

export const ProUserUnlockedCleanup = () => {
  const suggestions = [
    mockCleanupSuggestion(),
    mockCleanupSuggestion({
      id: 'suggestion-old-promotions',
      rule: 'old-promotions',
      label: '87 promotional emails detected',
      description: 'Promotional emails that are more than 30 days old and unlikely to be needed.',
      count: 87,
      action: 'delete',
      estimatedMinutesSaved: 15,
      pro: true,
    }),
  ];

  return (
    <MockProvider initialEntries={['/cleanup']}>
      <CleanupPage mockUser={mockUser()} mockSuggestions={suggestions} isPro />
    </MockProvider>
  );
};
