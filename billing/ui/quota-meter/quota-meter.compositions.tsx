import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockFreeUserPlan, mockProUserPlan } from '@lov/billing.entities.plan';
import { QuotaMeter } from './quota-meter.js';

export const LowUsage = () => {
  const userPlan = mockFreeUserPlan({ aiRepliesUsed: 6, aiRepliesLimit: 30 });

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '360px' }}>
        <QuotaMeter userPlan={userPlan} />
      </div>
    </MockProvider>
  );
};

export const NearingLimitWithUpgradeLink = () => {
  const userPlan = mockFreeUserPlan({ aiRepliesUsed: 27, aiRepliesLimit: 30 });

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '360px' }}>
        <QuotaMeter userPlan={userPlan} upgradeHref="/settings/billing" />
      </div>
    </MockProvider>
  );
};

export const UnlimitedForProUsers = () => {
  const userPlan = mockProUserPlan();

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '360px' }}>
        <QuotaMeter userPlan={userPlan} />
      </div>
    </MockProvider>
  );
};

export const CompactSidebarVariant = () => {
  const freePlan = mockFreeUserPlan({ aiRepliesUsed: 18, aiRepliesLimit: 30 });
  const almostOutPlan = mockFreeUserPlan({ aiRepliesUsed: 29, aiRepliesLimit: 30 });
  const proPlan = mockProUserPlan();

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem', maxWidth: '260px' }}>
        <QuotaMeter userPlan={freePlan} compact />
        <QuotaMeter userPlan={almostOutPlan} compact upgradeHref="/settings/billing" />
        <QuotaMeter userPlan={proPlan} compact />
      </div>
    </MockProvider>
  );
};
