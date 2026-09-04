import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { User } from '@lov/inbox-platform.entities.user';
import { mockFreeUserPlan, mockProUserPlan, PLAN_CATALOG } from '@lov/billing.entities.plan';
import { BillingPage } from './billing-page.js';

const mockUser = User.from({
  id: `user-peter-novak`,
  email: `peter@inboxassistant.ai`,
  name: `Peter Novak`,
  createdAt: `2024-01-10T09:00:00.000Z`,
});

export const FreePlanBillingPage = () => {
  const freePlan = mockFreeUserPlan({ aiRepliesUsed: 22, aiRepliesLimit: 30 }).toObject();

  return (
    <MockProvider initialEntries={['/billing']}>
      <BillingPage mockUser={mockUser} mockPlan={freePlan} mockPlans={PLAN_CATALOG} />
    </MockProvider>
  );
};

export const ProPlanBillingPage = () => {
  const proPlan = mockProUserPlan().toObject();

  return (
    <MockProvider initialEntries={['/billing']}>
      <BillingPage mockUser={mockUser} mockPlan={proPlan} mockPlans={PLAN_CATALOG} />
    </MockProvider>
  );
};

export const NearingQuotaLimitBillingPage = () => {
  const freePlan = mockFreeUserPlan({ aiRepliesUsed: 29, aiRepliesLimit: 30 }).toObject();

  return (
    <MockProvider initialEntries={['/billing']}>
      <BillingPage mockUser={mockUser} mockPlan={freePlan} mockPlans={PLAN_CATALOG} />
    </MockProvider>
  );
};
