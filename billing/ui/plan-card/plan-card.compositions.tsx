import React, { useState } from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockFreePlan, mockProPlan } from '@lov/billing.entities.plan';
import type { PlanId } from '@lov/billing.entities.plan';
import { PlanCard } from './plan-card.js';

export const PlanCardsOnFreePlan = () => {
  const freePlan = mockFreePlan();
  const proPlan = mockProPlan();

  return (
    <MockProvider>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '1.5rem' }}>
        <PlanCard plan={freePlan} currentPlanId="free" onSelect={() => {}} />
        <PlanCard plan={proPlan} currentPlanId="free" onSelect={() => {}} />
      </div>
    </MockProvider>
  );
};

export const PlanCardsOnProPlan = () => {
  const freePlan = mockFreePlan();
  const proPlan = mockProPlan();

  return (
    <MockProvider>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '1.5rem' }}>
        <PlanCard plan={freePlan} currentPlanId="pro" onSelect={() => {}} />
        <PlanCard plan={proPlan} currentPlanId="pro" onSelect={() => {}} />
      </div>
    </MockProvider>
  );
};

export const InteractivePlanSelection = () => {
  const freePlan = mockFreePlan();
  const proPlan = mockProPlan();
  const [currentPlanId, setCurrentPlanId] = useState<PlanId>('free');
  const [loadingPlanId, setLoadingPlanId] = useState<PlanId | undefined>(undefined);

  const handleSelect = (planId: PlanId) => {
    setLoadingPlanId(planId);
    setTimeout(() => {
      setCurrentPlanId(planId);
      setLoadingPlanId(undefined);
    }, 800);
  };

  return (
    <MockProvider>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '1.5rem' }}>
        <PlanCard
          plan={freePlan}
          currentPlanId={currentPlanId}
          loading={loadingPlanId === 'free'}
          onSelect={() => handleSelect('free')}
        />
        <PlanCard
          plan={proPlan}
          currentPlanId={currentPlanId}
          loading={loadingPlanId === 'pro'}
          onSelect={() => handleSelect('pro')}
        />
      </div>
    </MockProvider>
  );
};
