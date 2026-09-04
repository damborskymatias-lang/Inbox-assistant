import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { User } from '@lov/inbox-platform.entities.user';
import { mockFreeUserPlan, mockProUserPlan, PLAN_CATALOG } from '@lov/billing.entities.plan';
import { BillingPage } from './billing-page.js';
import styles from './billing-page.module.scss';

const mockUser = User.from({
  id: `user-peter-novak`,
  email: `peter@inboxassistant.ai`,
  name: `Peter Novak`,
  createdAt: `2024-01-10T09:00:00.000Z`,
});

describe('BillingPage', () => {
  it('renders the current plan name for a free plan user', () => {
    const freePlan = mockFreeUserPlan().toObject();

    const { container } = render(
      <MockProvider initialEntries={['/billing']}>
        <BillingPage mockUser={mockUser} mockPlan={freePlan} mockPlans={PLAN_CATALOG} />
      </MockProvider>
    );

    const planName = container.querySelector(`.${styles.planName}`);
    expect(planName?.textContent).toContain('Free');
  });

  it('renders the current plan name for a pro plan user', () => {
    const proPlan = mockProUserPlan().toObject();

    const { container } = render(
      <MockProvider initialEntries={['/billing']}>
        <BillingPage mockUser={mockUser} mockPlan={proPlan} mockPlans={PLAN_CATALOG} />
      </MockProvider>
    );

    const planName = container.querySelector(`.${styles.planName}`);
    expect(planName?.textContent).toContain('Pro');
  });

  it('renders the feature list for the current plan', () => {
    const freePlan = mockFreeUserPlan().toObject();

    const { container } = render(
      <MockProvider initialEntries={['/billing']}>
        <BillingPage mockUser={mockUser} mockPlan={freePlan} mockPlans={PLAN_CATALOG} />
      </MockProvider>
    );

    const featureList = container.querySelector(`.${styles.featureList}`);
    expect(featureList?.textContent).toContain('AI-generated replies');
  });

  it('renders the quota reset date', () => {
    const freePlan = mockFreeUserPlan({ periodEnd: `2024-05-31T23:59:59.000Z` }).toObject();

    const { container } = render(
      <MockProvider initialEntries={['/billing']}>
        <BillingPage mockUser={mockUser} mockPlan={freePlan} mockPlans={PLAN_CATALOG} />
      </MockProvider>
    );

    const resetNote = container.querySelector(`.${styles.resetNote}`);
    expect(resetNote?.textContent).toContain('May 31, 2024');
  });

  it('renders the MVP note about payment processing', () => {
    const freePlan = mockFreeUserPlan().toObject();

    const { container } = render(
      <MockProvider initialEntries={['/billing']}>
        <BillingPage mockUser={mockUser} mockPlan={freePlan} mockPlans={PLAN_CATALOG} />
      </MockProvider>
    );

    const mvpNote = container.querySelector(`.${styles.mvpNote}`);
    expect(mvpNote?.textContent).toContain('not part of the MVP');
  });

  it('opens a confirm dialog when selecting a different plan', () => {
    const freePlan = mockFreeUserPlan().toObject();

    const { container } = render(
      <MockProvider initialEntries={['/billing']}>
        <BillingPage mockUser={mockUser} mockPlan={freePlan} mockPlans={PLAN_CATALOG} />
      </MockProvider>
    );

    const buttons = container.querySelectorAll('button');
    const upgradeButton = Array.from(buttons).find((button) =>
      button.textContent?.includes('Upgrade')
    );

    expect(upgradeButton).toBeTruthy();

    if (upgradeButton) {
      fireEvent.click(upgradeButton);
    }

    const dialogTitle = container.querySelector('[role="dialog"]');
    expect(dialogTitle?.textContent).toContain('Pro');
  });

  it('closes the confirm dialog when cancel is clicked', () => {
    const freePlan = mockFreeUserPlan().toObject();

    const { container } = render(
      <MockProvider initialEntries={['/billing']}>
        <BillingPage mockUser={mockUser} mockPlan={freePlan} mockPlans={PLAN_CATALOG} />
      </MockProvider>
    );

    const buttons = container.querySelectorAll('button');
    const upgradeButton = Array.from(buttons).find((button) =>
      button.textContent?.includes('Upgrade')
    );

    if (upgradeButton) {
      fireEvent.click(upgradeButton);
    }

    const dialogButtons = container.querySelectorAll('button');
    const cancelButton = Array.from(dialogButtons).find(
      (button) => button.textContent === 'Cancel'
    );

    if (cancelButton) {
      fireEvent.click(cancelButton);
    }

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeNull();
  });
});
