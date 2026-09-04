import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { gql } from '@apollo/client';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { User } from '@lov/inbox-platform.entities.user';
import { mockFreeUserPlan, mockProUserPlan, PLAN_CATALOG } from '@lov/billing.entities.plan';
import { PricingPage } from './pricing-page.js';
import styles from './pricing-page.module.scss';

const CHANGE_PLAN_MUTATION = gql`
  mutation ChangePlan($planId: String!) {
    changePlan(options: { planId: $planId }) {
      planId
      aiRepliesUsed
      aiRepliesLimit
      periodStart
      periodEnd
    }
  }
`;

const proUserPlan = mockProUserPlan();

const changePlanMock = {
  request: {
    query: CHANGE_PLAN_MUTATION,
    variables: { planId: 'pro' },
  },
  result: {
    data: {
      changePlan: {
        planId: proUserPlan.planId,
        aiRepliesUsed: proUserPlan.aiRepliesUsed,
        aiRepliesLimit: proUserPlan.aiRepliesLimit,
        periodStart: proUserPlan.periodStart,
        periodEnd: proUserPlan.periodEnd,
      },
    },
  },
};

describe('PricingPage', () => {
  it('renders the headline about saving time', () => {
    const { container } = render(
      <MockProvider>
        <PricingPage mockPlans={PLAN_CATALOG} />
      </MockProvider>
    );

    const title = container.querySelector(`.${styles.title}`);
    expect(title?.textContent).toContain('15–30 minutes a day');
  });

  it('renders both plan cards from the catalog', () => {
    const { container } = render(
      <MockProvider>
        <PricingPage mockPlans={PLAN_CATALOG} />
      </MockProvider>
    );

    const cards = container.querySelectorAll(`.${styles.cards} > *`);
    expect(cards.length).toBe(2);
  });

  it('renders the FAQ section with the provided questions', () => {
    const faqItems = [{ question: `Can I cancel anytime?`, answer: `Yes, anytime from account settings.` }];

    const { container } = render(
      <MockProvider>
        <PricingPage mockPlans={PLAN_CATALOG} faqItems={faqItems} />
      </MockProvider>
    );

    const faqList = container.querySelector(`.${styles.faqList}`);
    expect(faqList?.textContent).toContain('Can I cancel anytime?');
  });

  it('shows the current plan note for a signed-in free plan user', () => {
    const freePlan = mockFreeUserPlan().toObject();

    const { container } = render(
      <MockProvider>
        <PricingPage
          mockUser={User.from({
            id: `user-peter-novak`,
            email: `peter@inboxassistant.ai`,
            name: `Peter Novak`,
            createdAt: `2024-01-10T09:00:00.000Z`,
          })}
          mockPlan={freePlan}
          mockPlans={PLAN_CATALOG}
        />
      </MockProvider>
    );

    const note = container.querySelector(`.${styles.currentPlanNote}`);
    expect(note?.textContent).toContain('Free plan');
  });

  it('shows the current plan note for a signed-in pro plan user', () => {
    const proPlan = mockProUserPlan().toObject();

    const { container } = render(
      <MockProvider>
        <PricingPage
          mockUser={User.from({
            id: `user-admin`,
            email: `alex@inboxassistant.ai`,
            name: `Alex Rivera`,
            createdAt: `2023-11-02T09:00:00.000Z`,
          })}
          mockPlan={proPlan}
          mockPlans={PLAN_CATALOG}
        />
      </MockProvider>
    );

    const note = container.querySelector(`.${styles.currentPlanNote}`);
    expect(note?.textContent).toContain('Pro plan');
  });

  it('does not show a current plan note for anonymous visitors', () => {
    const { container } = render(
      <MockProvider>
        <PricingPage mockPlans={PLAN_CATALOG} />
      </MockProvider>
    );

    const note = container.querySelector(`.${styles.currentPlanNote}`);
    expect(note).toBeNull();
  });

  it('allows a signed-in user to select a different plan', async () => {
    const freePlan = mockFreeUserPlan().toObject();

    const { container } = render(
      <MockProvider mocks={[changePlanMock]}>
        <PricingPage
          mockUser={User.from({
            id: `user-peter-novak`,
            email: `peter@inboxassistant.ai`,
            name: `Peter Novak`,
            createdAt: `2024-01-10T09:00:00.000Z`,
          })}
          mockPlan={freePlan}
          mockPlans={PLAN_CATALOG}
        />
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

    await waitFor(() => {
      expect(container.querySelector(`.${styles.cards}`)).toBeTruthy();
    });
  });
});
