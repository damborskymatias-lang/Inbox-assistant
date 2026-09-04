import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockDailySummary } from '@lov/assistant.entities.daily-summary';
import { DailySummaryCard } from './daily-summary-card.js';
import styles from './daily-summary-card.module.scss';

it('should render the greeting with the given name', () => {
  const summary = mockDailySummary().toObject();
  const { container } = render(
    <MockProvider>
      <DailySummaryCard summary={summary} name="Alex" />
    </MockProvider>
  );

  const heading = container.querySelector('h2');
  expect(heading?.textContent).toContain('Good morning, Alex');
});

it('should render the total number of new emails', () => {
  const summary = mockDailySummary({ totalNew: 12 }).toObject();
  const { getByText } = render(
    <MockProvider>
      <DailySummaryCard summary={summary} name="Alex" />
    </MockProvider>
  );

  expect(getByText('12 new emails')).toBeTruthy();
});

it('should render highlight items', () => {
  const summary = mockDailySummary({ highlights: ['Something important happened'] }).toObject();
  const { container } = render(
    <MockProvider>
      <DailySummaryCard summary={summary} name="Alex" />
    </MockProvider>
  );

  const bulletItems = container.querySelectorAll(`.${styles.bullets} li`);
  expect(bulletItems.length).toBe(1);
});

it('should render suggested actions as links when an emailId is provided', () => {
  const summary = mockDailySummary({
    suggestedActions: [{ label: 'Reply to Dana', emailId: 'e9', kind: 'reply' }],
  }).toObject();

  const { container } = render(
    <MockProvider>
      <DailySummaryCard summary={summary} name="Alex" />
    </MockProvider>
  );

  const link = container.querySelector(`.${styles.actionLink}`) as HTMLAnchorElement;
  expect(link).toBeTruthy();
  expect(link.getAttribute('href')).toContain('e9');
});

it('should render skeleton placeholders while loading', () => {
  const summary = mockDailySummary().toObject();
  const { container } = render(
    <MockProvider>
      <DailySummaryCard summary={summary} name="Alex" loading />
    </MockProvider>
  );

  const loadingState = container.querySelector(`.${styles.loadingState}`);
  expect(loadingState).toBeTruthy();
});

it('should call onRegenerate when the regenerate action is clicked', () => {
  const summary = mockDailySummary().toObject();
  let called = false;
  const handleRegenerate = () => {
    called = true;
  };

  const { container } = render(
    <MockProvider>
      <DailySummaryCard summary={summary} name="Alex" onRegenerate={() => handleRegenerate()} />
    </MockProvider>
  );

  const button = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(button);

  expect(called).toBe(true);
});
