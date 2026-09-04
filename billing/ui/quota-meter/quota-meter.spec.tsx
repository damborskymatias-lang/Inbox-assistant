import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockFreeUserPlan, mockProUserPlan } from '@lov/billing.entities.plan';
import { QuotaMeter } from './quota-meter.js';
import styles from './quota-meter.module.scss';

it('should render the used and limit values', () => {
  const userPlan = mockFreeUserPlan({ aiRepliesUsed: 18, aiRepliesLimit: 30 });
  const { getByText } = render(
    <MockProvider>
      <QuotaMeter userPlan={userPlan} />
    </MockProvider>
  );

  expect(getByText('18 / 30')).toBeTruthy();
});

it('should not show the upgrade link when usage is low', () => {
  const userPlan = mockFreeUserPlan({ aiRepliesUsed: 6, aiRepliesLimit: 30 });
  const { container } = render(
    <MockProvider>
      <QuotaMeter userPlan={userPlan} />
    </MockProvider>
  );

  const upgradeLink = container.querySelector(`.${styles.upgradeLink}`);
  expect(upgradeLink).toBeFalsy();
});

it('should show the upgrade link when the quota is nearly exhausted', () => {
  const userPlan = mockFreeUserPlan({ aiRepliesUsed: 27, aiRepliesLimit: 30 });
  const { container, getByText } = render(
    <MockProvider>
      <QuotaMeter userPlan={userPlan} upgradeHref="/settings/billing" />
    </MockProvider>
  );

  const upgradeLink = container.querySelector(`.${styles.upgradeLink}`) as HTMLAnchorElement;
  expect(upgradeLink).toBeTruthy();
  expect(upgradeLink.getAttribute('href')).toBe('/settings/billing');
  expect(getByText('Upgrade to Pro')).toBeTruthy();
});

it('should render "Unlimited replies" with a crown for pro users', () => {
  const userPlan = mockProUserPlan();
  const { getByText, container } = render(
    <MockProvider>
      <QuotaMeter userPlan={userPlan} />
    </MockProvider>
  );

  expect(getByText('Unlimited replies')).toBeTruthy();
  expect(container.querySelector(`.${styles.unlimited}`)).toBeTruthy();
});

it('should apply the compact class name when the compact prop is set', () => {
  const userPlan = mockFreeUserPlan({ aiRepliesUsed: 18, aiRepliesLimit: 30 });
  const { container } = render(
    <MemoryRouter>
      <QuotaMeter userPlan={userPlan} compact />
    </MemoryRouter>
  );

  expect(container.querySelector(`.${styles.compact}`)).toBeTruthy();
});

it('should apply a custom class name to the root element', () => {
  const userPlan = mockFreeUserPlan({ aiRepliesUsed: 18, aiRepliesLimit: 30 });
  const { container } = render(
    <MemoryRouter>
      <QuotaMeter userPlan={userPlan} className="custom-quota-meter" />
    </MemoryRouter>
  );

  expect(container.querySelector('.custom-quota-meter')).toBeTruthy();
});
