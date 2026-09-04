import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockFreeUserPlan, mockProUserPlan } from '@lov/billing.entities.plan';
import { PlanPanel } from './plan-panel.js';

export const FreePlanWithLowUsage = () => {
  const mockPlan = mockFreeUserPlan({ aiRepliesUsed: 6, aiRepliesLimit: 30 }).toObject();

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '360px' }}>
        <PlanPanel mockPlan={mockPlan} />
      </div>
    </MockProvider>
  );
};

export const FreePlanNearingLimit = () => {
  const mockPlan = mockFreeUserPlan({ aiRepliesUsed: 27, aiRepliesLimit: 30 }).toObject();

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '360px' }}>
        <PlanPanel mockPlan={mockPlan} upgradeHref="/settings/billing" />
      </div>
    </MockProvider>
  );
};

export const ProPlanUnlimited = () => {
  const mockPlan = mockProUserPlan().toObject();

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '360px' }}>
        <PlanPanel mockPlan={mockPlan} />
      </div>
    </MockProvider>
  );
};
