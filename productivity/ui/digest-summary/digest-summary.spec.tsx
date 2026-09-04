import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { PlainDailyDigest } from '@lov/productivity.entities.daily-digest';
import { DigestSummary } from './digest-summary.js';
import styles from './digest-summary.module.scss';

const digest: PlainDailyDigest = {
  id: `digest-today`,
  userId: `user-1`,
  date: `2024-06-07`,
  emailsProcessed: 38,
  repliesSent: 4,
  emailsCleaned: 42,
  minutesSaved: 34.4,
};

const history: PlainDailyDigest[] = [
  {
    id: `digest-1`,
    userId: `user-1`,
    date: `2024-06-01`,
    emailsProcessed: 31,
    repliesSent: 3,
    emailsCleaned: 12,
    minutesSaved: 17.4,
  },
  {
    id: `digest-2`,
    userId: `user-1`,
    date: `2024-06-02`,
    emailsProcessed: 42,
    repliesSent: 5,
    emailsCleaned: 0,
    minutesSaved: 22.5,
  },
];

it(`should render stat tile counts from the digest prop`, () => {
  const { container } = render(
    <MemoryRouter>
      <DigestSummary digest={digest} history={history} />
    </MemoryRouter>
  );

  const text = container.textContent || ``;
  expect(text).toContain(`34`);
  expect(text).toContain(`38`);
  expect(text).toContain(`4`);
  expect(text).toContain(`42`);
});

it(`should render a trend bar per history entry`, () => {
  const { container } = render(
    <MemoryRouter>
      <DigestSummary digest={digest} history={history} />
    </MemoryRouter>
  );

  const columns = container.querySelectorAll(`.${styles.trendColumn}`);
  expect(columns.length).toBe(history.length);
});

it(`should render skeleton placeholders when loading`, () => {
  const { container } = render(
    <MemoryRouter>
      <DigestSummary loading />
    </MemoryRouter>
  );

  const skeletonTiles = container.querySelectorAll(`.${styles.skeletonTile}`);
  const skeletonTrend = container.querySelectorAll(`.${styles.skeletonTrend}`);
  expect(skeletonTiles.length).toBeGreaterThan(0);
  expect(skeletonTrend.length).toBe(1);
});

it(`should not render skeleton placeholders when not loading`, () => {
  const { container } = render(
    <MemoryRouter>
      <DigestSummary digest={digest} history={history} />
    </MemoryRouter>
  );

  const skeletonTiles = container.querySelectorAll(`.${styles.skeletonTile}`);
  expect(skeletonTiles.length).toBe(0);
});
