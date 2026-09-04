import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import type { PlainDailyDigest } from '@lov/productivity.entities.daily-digest';
import { DigestPanel } from './digest-panel.js';
import styles from './digest-panel.module.scss';

const todayDigest: PlainDailyDigest = {
  id: `digest-today`,
  userId: `user-peter-novak`,
  date: `2024-06-07`,
  emailsProcessed: 38,
  repliesSent: 4,
  emailsCleaned: 42,
  minutesSaved: 34.4,
};

it(`should render the rounded minutes saved value`, () => {
  const { container } = render(
    <MockProvider>
      <DigestPanel digest={todayDigest} />
    </MockProvider>
  );

  const value = container.querySelector(`.${styles.value}`);
  expect(value?.textContent).toBe(`34`);
});

it(`should render the digest stats`, () => {
  const { container } = render(
    <MockProvider>
      <DigestPanel digest={todayDigest} />
    </MockProvider>
  );

  const statValues = container.querySelectorAll(`.${styles.statValue}`);
  const values = Array.from(statValues).map((el) => el.textContent);
  expect(values).toEqual([`38`, `4`, `42`]);
});

it(`should render a link to the default digest path`, () => {
  const { container } = render(
    <MockProvider>
      <DigestPanel digest={todayDigest} />
    </MockProvider>
  );

  const link = container.querySelector(`a`);
  expect(link?.getAttribute(`href`)).toBe(`/digest`);
});

it(`should render a link to a custom digest path`, () => {
  const { container } = render(
    <MockProvider>
      <DigestPanel digest={todayDigest} digestLink="/digest/history" />
    </MockProvider>
  );

  const link = container.querySelector(`a`);
  expect(link?.getAttribute(`href`)).toBe(`/digest/history`);
});
