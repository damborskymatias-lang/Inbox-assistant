import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockFreePlan, mockProPlan } from '@lov/billing.entities.plan';
import { PlanCard } from './plan-card.js';
import styles from './plan-card.module.scss';

it('should render the plan name and price for a free plan', () => {
  const plan = mockFreePlan();
  const { container } = render(
    <MockProvider>
      <PlanCard plan={plan} currentPlanId="free" />
    </MockProvider>
  );

  const heading = container.querySelector('h3');
  expect(heading?.textContent).toBe('Free');

  const price = container.querySelector(`.${styles.price}`);
  expect(price?.textContent).toBe('Free');
});

it('should render the price for a paid plan', () => {
  const plan = mockProPlan();
  const { container } = render(
    <MockProvider>
      <PlanCard plan={plan} currentPlanId="free" />
    </MockProvider>
  );

  const price = container.querySelector(`.${styles.price}`);
  expect(price?.textContent).toBe('€12 / month');
});

it('should render the feature list items', () => {
  const plan = mockFreePlan();
  const { container } = render(
    <MockProvider>
      <PlanCard plan={plan} currentPlanId="free" />
    </MockProvider>
  );

  const featureItems = container.querySelectorAll(`.${styles.feature}`);
  expect(featureItems.length).toBe(plan.features.length);
});

it('should show the "Most popular" badge when the plan is highlighted', () => {
  const plan = mockProPlan();
  const { container, getByText } = render(
    <MockProvider>
      <PlanCard plan={plan} currentPlanId="free" />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.badge}`)).toBeTruthy();
  expect(getByText('Most popular')).toBeTruthy();
});

it('should not show the "Most popular" badge for a non-highlighted plan', () => {
  const plan = mockFreePlan();
  const { container } = render(
    <MockProvider>
      <PlanCard plan={plan} currentPlanId="free" />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.badge}`)).toBeFalsy();
});

it('should show "Current plan" and disable the button when the plan matches currentPlanId', () => {
  const plan = mockFreePlan();
  const { container } = render(
    <MockProvider>
      <PlanCard plan={plan} currentPlanId="free" />
    </MockProvider>
  );

  const button = container.querySelector('button');
  expect(button?.textContent).toBe('Current plan');
  expect(button?.disabled).toBe(true);
});

it('should show "Upgrade to Pro" when selecting a higher priced plan', () => {
  const plan = mockProPlan();
  const { container } = render(
    <MockProvider>
      <PlanCard plan={plan} currentPlanId="free" />
    </MockProvider>
  );

  const button = container.querySelector('button');
  expect(button?.textContent).toBe('Upgrade to Pro');
});

it('should show "Downgrade" when selecting the free plan from a paid plan', () => {
  const plan = mockFreePlan();
  const { container } = render(
    <MockProvider>
      <PlanCard plan={plan} currentPlanId="pro" />
    </MockProvider>
  );

  const button = container.querySelector('button');
  expect(button?.textContent).toBe('Downgrade');
});

it('should call onSelect with the plan id when the cta is clicked', () => {
  const plan = mockProPlan();
  let selectedPlanId: string | undefined;

  const { container } = render(
    <MockProvider>
      <PlanCard plan={plan} currentPlanId="free" onSelect={(planId) => (selectedPlanId = planId)} />
    </MockProvider>
  );

  const button = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(button);

  expect(selectedPlanId).toBe('pro');
});
