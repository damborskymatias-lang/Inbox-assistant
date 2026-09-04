import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { InboxSummaryPanel } from './inbox-summary-panel.js';
import styles from './inbox-summary-panel.module.scss';

const COUNTS = { urgent: 5, needsReply: 12, fyi: 18, promotions: 31, total: 66 };

it(`should render the panel title`, () => {
  const { container } = render(
    <MockProvider>
      <InboxSummaryPanel mockCounts={COUNTS} />
    </MockProvider>
  );

  const rendered = container.textContent;
  expect(rendered).toContain(`Inbox summary`);
});

it(`should render the panel root with its class name`, () => {
  const { container } = render(
    <MockProvider>
      <InboxSummaryPanel mockCounts={COUNTS} />
    </MockProvider>
  );

  const panel = container.querySelector(`.${styles.panel}`);
  expect(panel).toBeTruthy();
});

it(`should render the triage tile counts`, () => {
  const { container } = render(
    <MockProvider>
      <InboxSummaryPanel mockCounts={COUNTS} />
    </MockProvider>
  );

  const rendered = container.textContent;
  expect(rendered).toContain(`5`);
  expect(rendered).toContain(`12`);
  expect(rendered).toContain(`18`);
  expect(rendered).toContain(`31`);
});

it(`should not throw when a tile is clicked`, () => {
  const { container } = render(
    <MockProvider>
      <InboxSummaryPanel mockCounts={COUNTS} />
    </MockProvider>
  );

  const tile = container.querySelector(`button, [role="button"]`);
  expect(() => {
    if (tile) fireEvent.click(tile);
  }).not.toThrow();
});
