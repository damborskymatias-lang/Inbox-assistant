import { UserPlan, canPlanUseFeature, GATED_FEATURE_PLANS } from './user-plan.js';
import { mockFreeUserPlan, mockProUserPlan } from './user-plan.mock.js';

it('has a UserPlan.from() method', () => {
  expect(UserPlan.from).toBeTruthy();
});

it('creates a UserPlan instance from a plain object', () => {
  const userPlan = UserPlan.from({
    id: 'u1',
    planId: 'free',
    aiRepliesUsed: 5,
    aiRepliesLimit: 30,
    periodStart: '2024-05-01T00:00:00.000Z',
    periodEnd: '2024-05-31T23:59:59.000Z',
  });

  expect(userPlan).toBeInstanceOf(UserPlan);
  expect(userPlan.planId).toEqual('free');
  expect(userPlan.aiRepliesUsed).toEqual(5);
});

it('serializes a UserPlan into a plain object with toObject()', () => {
  const userPlan = mockFreeUserPlan();
  const plainUserPlan = userPlan.toObject();

  expect(plainUserPlan).toEqual({
    id: userPlan.id,
    planId: userPlan.planId,
    aiRepliesUsed: userPlan.aiRepliesUsed,
    aiRepliesLimit: userPlan.aiRepliesLimit,
    periodStart: userPlan.periodStart,
    periodEnd: userPlan.periodEnd,
  });
});

it('round-trips a UserPlan through toObject() and from()', () => {
  const original = mockProUserPlan();
  const restored = UserPlan.from(original.toObject());

  expect(restored).toEqual(original);
});

it('computes remaining AI replies and availability', () => {
  const userPlan = mockFreeUserPlan({ aiRepliesUsed: 30, aiRepliesLimit: 30 });

  expect(userPlan.hasAiRepliesRemaining).toEqual(false);
  expect(userPlan.aiRepliesRemaining).toEqual(0);

  const fresh = mockFreeUserPlan({ aiRepliesUsed: 10, aiRepliesLimit: 30 });
  expect(fresh.hasAiRepliesRemaining).toEqual(true);
  expect(fresh.aiRepliesRemaining).toEqual(20);
});

it('gates pro-only features behind the pro plan', () => {
  expect(canPlanUseFeature('free', 'unlimitedAiReplies')).toEqual(false);
  expect(canPlanUseFeature('pro', 'unlimitedAiReplies')).toEqual(true);
  expect(GATED_FEATURE_PLANS.smartInboxCleanup).toEqual(['pro']);
});

it('exposes a canUse() helper on the entity instance', () => {
  const freeUserPlan = mockFreeUserPlan();
  const proUserPlan = mockProUserPlan();

  expect(freeUserPlan.canUse('advancedFilters')).toEqual(false);
  expect(proUserPlan.canUse('advancedFilters')).toEqual(true);
});

it('defaults missing properties safely when deserializing', () => {
  // @ts-expect-error - testing defensive defaults for malformed input
  const userPlan = UserPlan.from({});

  expect(userPlan.id).toEqual('');
  expect(userPlan.planId).toEqual('free');
  expect(userPlan.aiRepliesUsed).toEqual(0);
  expect(userPlan.aiRepliesLimit).toEqual(30);
});
