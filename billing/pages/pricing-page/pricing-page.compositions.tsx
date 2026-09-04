import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { User } from '@lov/inbox-platform.entities.user';
import { mockFreeUserPlan, mockProUserPlan, PLAN_CATALOG } from '@lov/billing.entities.plan';
import { PricingPage } from './pricing-page.js';

export const AnonymousVisitorPricingPage = () => {
  return (
    <MockProvider>
      <PricingPage mockPlans={PLAN_CATALOG} />
    </MockProvider>
  );
};

export const SignedInOnFreePlan = () => {
  const freePlan = mockFreeUserPlan().toObject();

  return (
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
};

export const SignedInOnProPlan = () => {
  const proPlan = mockProUserPlan().toObject();

  return (
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
};
