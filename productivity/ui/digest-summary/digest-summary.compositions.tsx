import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import type { PlainDailyDigest } from '@lov/productivity.entities.daily-digest';
import { DigestSummary } from './digest-summary.js';

const todayDigest: PlainDailyDigest = {
  id: `digest-today`,
  userId: `user-peter-novak`,
  date: `2024-06-07`,
  emailsProcessed: 38,
  repliesSent: 4,
  emailsCleaned: 42,
  minutesSaved: 34.4,
};

const weekHistory: PlainDailyDigest[] = [
  {
    id: `digest-1`,
    userId: `user-peter-novak`,
    date: `2024-06-01`,
    emailsProcessed: 31,
    repliesSent: 3,
    emailsCleaned: 12,
    minutesSaved: 17.4,
  },
  {
    id: `digest-2`,
    userId: `user-peter-novak`,
    date: `2024-06-02`,
    emailsProcessed: 42,
    repliesSent: 5,
    emailsCleaned: 0,
    minutesSaved: 22.5,
  },
  {
    id: `digest-3`,
    userId: `user-peter-novak`,
    date: `2024-06-03`,
    emailsProcessed: 27,
    repliesSent: 2,
    emailsCleaned: 18,
    minutesSaved: 19.1,
  },
  {
    id: `digest-4`,
    userId: `user-peter-novak`,
    date: `2024-06-04`,
    emailsProcessed: 35,
    repliesSent: 4,
    emailsCleaned: 0,
    minutesSaved: 16.5,
  },
  {
    id: `digest-5`,
    userId: `user-peter-novak`,
    date: `2024-06-05`,
    emailsProcessed: 44,
    repliesSent: 6,
    emailsCleaned: 25,
    minutesSaved: 34.5,
  },
  {
    id: `digest-6`,
    userId: `user-peter-novak`,
    date: `2024-06-06`,
    emailsProcessed: 19,
    repliesSent: 1,
    emailsCleaned: 0,
    minutesSaved: 5.5,
  },
  todayDigest,
];

export const BasicDigestSummary = () => {
  return (
    <MockProvider>
      <div style={{ padding: `1.5rem`, maxWidth: `640px` }}>
        <DigestSummary digest={todayDigest} history={weekHistory} />
      </div>
    </MockProvider>
  );
};

export const LoadingDigestSummary = () => {
  return (
    <MockProvider>
      <div style={{ padding: `1.5rem`, maxWidth: `640px` }}>
        <DigestSummary loading />
      </div>
    </MockProvider>
  );
};

export const QuietDayDigestSummary = () => {
  const quietDigest: PlainDailyDigest = {
    id: `digest-quiet`,
    userId: `user-peter-novak`,
    date: `2024-06-07`,
    emailsProcessed: 6,
    repliesSent: 1,
    emailsCleaned: 0,
    minutesSaved: 5.5,
  };

  const quietHistory: PlainDailyDigest[] = [
    { ...weekHistory[0], minutesSaved: 3.2 },
    { ...weekHistory[1], minutesSaved: 8.1 },
    { ...weekHistory[2], minutesSaved: 2.4 },
    { ...weekHistory[3], minutesSaved: 6.9 },
    { ...weekHistory[4], minutesSaved: 4.3 },
    { ...weekHistory[5], minutesSaved: 1.1 },
    quietDigest,
  ];

  return (
    <MockProvider>
      <div style={{ padding: `1.5rem`, maxWidth: `640px` }}>
        <DigestSummary digest={quietDigest} history={quietHistory} />
      </div>
    </MockProvider>
  );
};
