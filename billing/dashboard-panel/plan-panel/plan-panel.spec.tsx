import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockFreeUserPlan, mockProUserPlan } from '@lov/billing.entities.plan';
import { PlanPanel } from './plan-panel.js';
import styles from './plan-panel.module.scss';

it('should render the free plan name', () => {
  const mockPlan = mockFreeUserPlan({ aiRepliesUsed: 6, aiRepliesLimit: 30 }).toObject();

  const { container } = render(
    <MockProvider>
      <PlanPanel mockPlan={mockPlan} />
    </MockProvider>
  );

  const planName = container.querySelector(`.${styles.planName}`);
  expect(planName?.textContent).toBe(`Free`);
});

it('should render the pro badge for pro users', () => {
  const mockPlan = mockProUserPlan().toObject();

  const { container } = render(
    <MockProvider>
      <PlanPanel mockPlan={mockPlan} />
    </MockProvider>
  );

  const badge = container.querySelector(`.${styles.proBadge}`);
  expect(badge?.textContent).toBe(`Pro`);
});

it('should not render the pro badge for free users', () => {
  const mockPlan = mockFreeUserPlan({ aiRepliesUsed: 6, aiRepliesLimit: 30 }).toObject();

  const { container } = render(
    <MockProvider>
      <PlanPanel mockPlan={mockPlan} />
    </MockProvider>
  );

  const badge = container.querySelector(`.${styles.proBadge}`);
  expect(badge).toBeNull();
});

it('should show an upgrade prompt when free usage is near the limit', () => {
  const mockPlan = mockFreeUserPlan({ aiRepliesUsed: 28, aiRepliesLimit: 30 }).toObject();

  const { container } = render(
    <MockProvider>
      <PlanPanel mockPlan={mockPlan} />
    </MockProvider>
  );

  const upgrade = container.querySelector(`.${styles.upgrade}`);
  expect(upgrade).toBeTruthy();
});

it('should not show an upgrade prompt when free usage is low', () => {
  const mockPlan = mockFreeUserPlan({ aiRepliesUsed: 6, aiRepliesLimit: 30 }).toObject();

  const { container } = render(
    <MockProvider>
      <PlanPanel mockPlan={mockPlan} />
    </MockProvider>
  );

  const upgrade = container.querySelector(`.${styles.upgrade}`);
  expect(upgrade).toBeNull();
});

it('should render the quota meter for pro users without an upgrade prompt', () => {
  const mockPlan = mockProUserPlan().toObject();

  const { container } = render(
    <MockProvider>
      <PlanPanel mockPlan={mockPlan} />
    </MockProvider>
  );

  const upgrade = container.querySelector(`.${styles.upgrade}`);
  expect(upgrade).toBeNull();
});
