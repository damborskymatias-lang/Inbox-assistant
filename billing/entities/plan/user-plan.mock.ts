import { UserPlan } from './user-plan.js';
import type { PlainUserPlan } from './user-plan.js';

/**
 * mock UserPlan on the Free tier, with some AI replies already used
 * during the current billing period.
 */
export function mockFreeUserPlan(overrides: Partial<PlainUserPlan> = {}): UserPlan {
  return UserPlan.from({
    id: 'user-peter-novak',
    planId: 'free',
    aiRepliesUsed: 12,
    aiRepliesLimit: 30,
    periodStart: '2024-05-01T00:00:00.000Z',
    periodEnd: '2024-05-31T23:59:59.000Z',
    ...overrides,
  });
}

/**
 * mock UserPlan on the Pro tier, with a high reply limit.
 */
export function mockProUserPlan(overrides: Partial<PlainUserPlan> = {}): UserPlan {
  return UserPlan.from({
    id: 'user-admin',
    planId: 'pro',
    aiRepliesUsed: 340,
    aiRepliesLimit: Number.MAX_SAFE_INTEGER,
    periodStart: '2024-05-01T00:00:00.000Z',
    periodEnd: '2024-05-31T23:59:59.000Z',
    ...overrides,
  });
}
