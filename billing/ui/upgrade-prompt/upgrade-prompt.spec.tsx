import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { UpgradePrompt } from './upgrade-prompt.js';
import styles from './upgrade-prompt.module.scss';

it('should render the inline variant with feature copy and cta', () => {
  const { container, getByText } = render(
    <MockProvider>
      <UpgradePrompt feature="unlimitedAiReplies" variant="inline" />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.inline}`)).toBeTruthy();
  expect(getByText('Unlimited AI replies are part of Pro — €12/month')).toBeTruthy();
  expect(getByText('Upgrade to Pro')).toBeTruthy();
});

it('should render the card variant with a headline and cta', () => {
  const { container, getByText } = render(
    <MockProvider>
      <UpgradePrompt feature="smartInboxCleanup" variant="card" />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.card}`)).toBeTruthy();
  expect(getByText('Keep your inbox spotless')).toBeTruthy();
  expect(getByText('Smart inbox cleanup is part of Pro — €12/month')).toBeTruthy();
});

it('should render the banner variant with a headline and cta', () => {
  const { container, getByText } = render(
    <MockProvider>
      <UpgradePrompt feature="priorityProcessing" variant="banner" />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.banner}`)).toBeTruthy();
  expect(getByText('Skip the queue')).toBeTruthy();
});

it('should link the cta to the given href', () => {
  const { container } = render(
    <MockProvider>
      <UpgradePrompt feature="unlimitedAiReplies" variant="inline" ctaHref="/pricing" />
    </MockProvider>
  );

  const link = container.querySelector('a') as HTMLAnchorElement;
  expect(link.getAttribute('href')).toBe('/pricing');
});

it('should render a custom cta label', () => {
  const { getByText } = render(
    <MockProvider>
      <UpgradePrompt feature="unlimitedAiReplies" variant="inline" ctaLabel="See plans" />
    </MockProvider>
  );

  expect(getByText('See plans')).toBeTruthy();
});

it('should call onDismiss when the dismiss action is clicked on the card variant', () => {
  let dismissed = false;
  const { container } = render(
    <MockProvider>
      <UpgradePrompt feature="smartInboxCleanup" variant="card" onDismiss={() => (dismissed = true)} />
    </MockProvider>
  );

  const buttons = container.querySelectorAll('button');
  const dismissButton = Array.from(buttons).find((button) => button.textContent === 'Not now');
  fireEvent.click(dismissButton as HTMLButtonElement);

  expect(dismissed).toBe(true);
});
