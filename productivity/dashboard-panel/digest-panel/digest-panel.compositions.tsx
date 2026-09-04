import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import type { PlainDailyDigest } from '@lov/productivity.entities.daily-digest';
import { DigestPanel } from './digest-panel.js';

const todayDigest: PlainDailyDigest = {
  id: `digest-today`,
  userId: `user-peter-novak`,
  date: `2024-06-07`,
  emailsProcessed: 38,
  repliesSent: 4,
  emailsCleaned: 42,
  minutesSaved: 34.4,
};

const quietDigest: PlainDailyDigest = {
  id: `digest-quiet`,
  userId: `user-peter-novak`,
  date: `2024-06-07`,
  emailsProcessed: 6,
  repliesSent: 1,
  emailsCleaned: 0,
  minutesSaved: 5.5,
};

export const BasicDigestPanel = () => {
  return (
    <MockProvider>
      <div style={{ padding: `1.5rem`, maxWidth: `360px` }}>
        <DigestPanel digest={todayDigest} />
      </div>
    </MockProvider>
  );
};

export const QuietDayDigestPanel = () => {
  return (
    <MockProvider>
      <div style={{ padding: `1.5rem`, maxWidth: `360px` }}>
        <DigestPanel digest={quietDigest} />
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
          gridTemplateColumns: `repeat(2, minmax(0, 1fr))`,
          gap: `1rem`,
          maxWidth: `760px`,
        }}
      >
        <DigestPanel digest={todayDigest} />
        <DigestPanel digest={quietDigest} digestLink="/digest/history" />
      </div>
    </MockProvider>
  );
};
