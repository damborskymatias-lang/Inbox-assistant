import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { InboxSummaryPanel } from './inbox-summary-panel.js';

export const BasicInboxSummaryPanel = () => {
  return (
    <MockProvider>
      <div style={{ padding: `1.5rem`, maxWidth: `900px` }}>
        <InboxSummaryPanel mockCounts={{ urgent: 5, needsReply: 12, fyi: 18, promotions: 31, total: 66 }} />
      </div>
    </MockProvider>
  );
};

export const EmptyInboxSummaryPanel = () => {
  return (
    <MockProvider>
      <div style={{ padding: `1.5rem`, maxWidth: `900px` }}>
        <InboxSummaryPanel mockCounts={{ urgent: 0, needsReply: 0, fyi: 0, promotions: 0, total: 0 }} />
      </div>
    </MockProvider>
  );
};

export const InDashboardGrid = () => {
  return (
    <MockProvider>
      <div
        style={{
          padding: `1.5rem`,
          display: `grid`,
          gridTemplateColumns: `repeat(2, 1fr)`,
          gap: `1rem`,
          maxWidth: `1100px`,
        }}
      >
        <InboxSummaryPanel mockCounts={{ urgent: 3, needsReply: 8, fyi: 14, promotions: 42, total: 67 }} />
      </div>
    </MockProvider>
  );
};
