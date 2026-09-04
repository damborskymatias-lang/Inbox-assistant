import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockCleanupSuggestion } from '@lov/cleanup.entities.cleanup-suggestion';
import { CleanupPanel } from './cleanup-panel.js';

export const BasicCleanupPanel = () => {
  const suggestions = [
    mockCleanupSuggestion(),
    mockCleanupSuggestion({
      id: `suggestion-old-promotions`,
      rule: `old-promotions`,
      label: `87 promotional emails detected`,
      description: `Promotional emails that are more than 30 days old and unlikely to be needed.`,
      count: 87,
      action: `delete`,
      estimatedMinutesSaved: 15,
      pro: true,
    }),
  ];

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '760px' }}>
        <CleanupPanel mockSuggestions={suggestions} />
      </div>
    </MockProvider>
  );
};

export const CleanupPanelForProUser = () => {
  const suggestions = [
    mockCleanupSuggestion({
      id: `suggestion-old-promotions`,
      rule: `old-promotions`,
      label: `87 promotional emails detected`,
      description: `Promotional emails that are more than 30 days old and unlikely to be needed.`,
      count: 87,
      action: `delete`,
      estimatedMinutesSaved: 45,
      pro: true,
    }),
  ];

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '760px' }}>
        <CleanupPanel isPro mockSuggestions={suggestions} cleanupHref="/cleanup" />
      </div>
    </MockProvider>
  );
};

export const CleanupPanelInDashboardGrid = () => {
  const suggestions = [mockCleanupSuggestion()];

  return (
    <MockProvider>
      <div
        style={{
          padding: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          maxWidth: '900px',
        }}
      >
        <div style={{ gridColumn: '1 / -1' }}>
          <CleanupPanel mockSuggestions={suggestions} />
        </div>
        <div style={{ padding: '1rem', border: '1px dashed #ccc', borderRadius: '8px' }}>
          Other dashboard widget
        </div>
        <div style={{ padding: '1rem', border: '1px dashed #ccc', borderRadius: '8px' }}>
          Other dashboard widget
        </div>
      </div>
    </MockProvider>
  );
};

export const EmptyCleanupPanel = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '760px' }}>
        <p style={{ fontSize: '0.85rem', color: '#666' }}>
          No suggestions available — the panel below renders nothing.
        </p>
        <CleanupPanel mockSuggestions={[]} />
      </div>
    </MockProvider>
  );
};
