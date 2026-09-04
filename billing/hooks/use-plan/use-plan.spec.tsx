import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockFreeUserPlan, mockProUserPlan, PLAN_CATALOG } from '@lov/billing.entities.plan';
import { usePlan } from './use-plan.js';

function Wrapper({ children }: { children?: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

it('should return the free plan and remaining replies from mock data', async () => {
  const freePlan = mockFreeUserPlan().toObject();

  const { result } = renderHook(() => usePlan({ mockPlan: freePlan, mockPlans: PLAN_CATALOG }), {
    wrapper: Wrapper,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.plan?.planId).toBe('free');
  expect(result.current.isPro).toBe(false);
  expect(result.current.remainingReplies).toBe(freePlan.aiRepliesLimit - freePlan.aiRepliesUsed);
});

it('should indicate pro status when the plan is pro', async () => {
  const proPlan = mockProUserPlan().toObject();

  const { result } = renderHook(() => usePlan({ mockPlan: proPlan, mockPlans: PLAN_CATALOG }), {
    wrapper: Wrapper,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.isPro).toBe(true);
});

it('should allow gated features for a pro plan', async () => {
  const proPlan = mockProUserPlan().toObject();

  const { result } = renderHook(() => usePlan({ mockPlan: proPlan, mockPlans: PLAN_CATALOG }), {
    wrapper: Wrapper,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.canUse('unlimitedAiReplies')).toBe(true);
});

it('should disallow gated features for a free plan', async () => {
  const freePlan = mockFreeUserPlan().toObject();

  const { result } = renderHook(() => usePlan({ mockPlan: freePlan, mockPlans: PLAN_CATALOG }), {
    wrapper: Wrapper,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.canUse('smartInboxCleanup')).toBe(false);
});

it('should return the plan catalog from mock data', async () => {
  const freePlan = mockFreeUserPlan().toObject();

  const { result } = renderHook(() => usePlan({ mockPlan: freePlan, mockPlans: PLAN_CATALOG }), {
    wrapper: Wrapper,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.plans.map((plan) => plan.id)).toEqual(['free', 'pro']);
});
