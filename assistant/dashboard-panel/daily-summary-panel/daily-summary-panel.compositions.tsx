import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockDailySummary } from '@lov/assistant.entities.daily-summary';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { DailySummaryPanel } from './daily-summary-panel.js';

export const BasicDailySummaryPanel = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '640px' }}>
        <DailySummaryPanel mockSummary={mockDailySummary().toObject()} mockUser={mockUser()} />
      </div>
    </MockProvider>
  );
};

export const DailySummaryPanelForAnotherUser = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '640px' }}>
        <DailySummaryPanel
          mockSummary={mockDailySummary({
            totalNew: 12,
            highlights: ['Sarah needs contract sign-off by Friday.'],
          }).toObject()}
          mockUser={mockUser({ name: 'Alex Rivera' })}
        />
      </div>
    </MockProvider>
  );
};

export const FullWidthDashboardPreview = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem' }}>
        <DailySummaryPanel mockSummary={mockDailySummary().toObject()} mockUser={mockUser()} />
      </div>
    </MockProvider>
  );
};
