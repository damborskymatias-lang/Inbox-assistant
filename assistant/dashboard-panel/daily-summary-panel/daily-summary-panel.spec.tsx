import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockDailySummary } from '@lov/assistant.entities.daily-summary';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { DailySummaryPanel } from './daily-summary-panel.js';

it('should render the greeting with the signed-in user first name', () => {
  const summary = mockDailySummary().toObject();
  const { container } = render(
    <MockProvider>
      <DailySummaryPanel mockSummary={summary} mockUser={mockUser({ name: 'Alex Rivera' })} />
    </MockProvider>
  );

  const heading = container.querySelector('h2');
  expect(heading?.textContent).toContain('Alex');
});

it('should render the total number of new emails from the summary', () => {
  const summary = mockDailySummary({ totalNew: 12 }).toObject();
  const { getByText } = render(
    <MockProvider>
      <DailySummaryPanel mockSummary={summary} mockUser={mockUser()} />
    </MockProvider>
  );

  expect(getByText('12 new emails')).toBeTruthy();
});

it('should render highlights from the summary', () => {
  const summary = mockDailySummary({
    highlights: ['Something important happened'],
  }).toObject();
  const { getByText } = render(
    <MockProvider>
      <DailySummaryPanel mockSummary={summary} mockUser={mockUser()} />
    </MockProvider>
  );

  expect(getByText('Something important happened')).toBeTruthy();
});

it('should not throw when the regenerate action is clicked', () => {
  const summary = mockDailySummary().toObject();
  const { container } = render(
    <MockProvider>
      <DailySummaryPanel mockSummary={summary} mockUser={mockUser()} />
    </MockProvider>
  );

  const button = container.querySelector('button') as HTMLButtonElement;
  expect(() => fireEvent.click(button)).not.toThrow();
});
