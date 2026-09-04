import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { TimeSavedIndicator } from './time-saved-indicator.js';

const heroDigest = {
  id: `digest-today`,
  userId: `user-peter-novak`,
  date: `2024-06-07`,
  emailsProcessed: 38,
  repliesSent: 4,
  emailsCleaned: 42,
  minutesSaved: 24,
};

const lightDayDigest = {
  id: `digest-light`,
  userId: `user-peter-novak`,
  date: `2024-06-06`,
  emailsProcessed: 12,
  repliesSent: 1,
  emailsCleaned: 0,
  minutesSaved: 5,
};

const bigDayDigest = {
  id: `digest-big`,
  userId: `user-peter-novak`,
  date: `2024-06-05`,
  emailsProcessed: 61,
  repliesSent: 9,
  emailsCleaned: 80,
  minutesSaved: 62,
};

export const BasicTimeSavedIndicator = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <TimeSavedIndicator digest={heroDigest} />
      </div>
    </MockProvider>
  );
};

export const LightActivityDay = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <TimeSavedIndicator digest={lightDayDigest} />
      </div>
    </MockProvider>
  );
};

export const InHeaderBar = () => {
  return (
    <MockProvider>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.5rem',
          background: 'var(--colors-surface-primary)',
          borderRadius: 'var(--borders-radius-large)',
        }}
      >
        <strong>Inbox Assistant</strong>
        <TimeSavedIndicator digest={bigDayDigest} digestHref="/dashboard/digest" />
      </div>
    </MockProvider>
  );
};
