import { v4 as uuid } from 'uuid';
import { DailyDigest } from './daily-digest.js';
import type { PlainDailyDigest } from './daily-digest.js';

/**
 * builds an ISO date (YYYY-MM-DD) offset by `daysAgo` days from today.
 */
function dateDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

/**
 * mock a single DailyDigest, supporting partial overrides of the default properties.
 */
export function mockDailyDigest(overrides: Partial<PlainDailyDigest> = {}): DailyDigest {
  return DailyDigest.from({
    id: uuid(),
    userId: 'user-peter-novak',
    date: dateDaysAgo(0),
    emailsProcessed: 38,
    repliesSent: 4,
    emailsCleaned: 42,
    minutesSaved: 34.4,
    ...overrides,
  });
}

/**
 * mock a week (7 days, oldest to newest) of daily digests for the demo
 * account, used to render the trend chart on the dashboard.
 */
export function mockWeeklyDigests(userId = 'user-peter-novak'): DailyDigest[] {
  const days = [
    { emailsProcessed: 31, repliesSent: 3, emailsCleaned: 12, minutesSaved: 17.4 },
    { emailsProcessed: 42, repliesSent: 5, emailsCleaned: 0, minutesSaved: 22.5 },
    { emailsProcessed: 27, repliesSent: 2, emailsCleaned: 18, minutesSaved: 19.1 },
    { emailsProcessed: 35, repliesSent: 4, emailsCleaned: 0, minutesSaved: 16.5 },
    { emailsProcessed: 44, repliesSent: 6, emailsCleaned: 25, minutesSaved: 34.5 },
    { emailsProcessed: 19, repliesSent: 1, emailsCleaned: 0, minutesSaved: 5.5 },
    { emailsProcessed: 38, repliesSent: 4, emailsCleaned: 42, minutesSaved: 34.4 },
  ];

  return days.map((day, index) =>
    mockDailyDigest({
      id: uuid(),
      userId,
      date: dateDaysAgo(days.length - 1 - index),
      ...day,
    })
  );
}
