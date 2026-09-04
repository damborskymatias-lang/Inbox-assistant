import { Plan } from './plan.js';
import { mockPlans, mockFreePlan, mockProPlan } from './plan.mock.js';

it('has a Plan.from() method', () => {
  expect(Plan.from).toBeTruthy();
});

it('creates a Plan instance from a plain object', () => {
  const plan = Plan.from({
    id: 'pro',
    name: 'Pro',
    priceEur: 12,
    interval: 'month',
    features: ['Unlimited AI replies'],
    highlighted: true,
  });

  expect(plan).toBeInstanceOf(Plan);
  expect(plan.id).toEqual('pro');
  expect(plan.priceEur).toEqual(12);
  expect(plan.highlighted).toEqual(true);
});

it('serializes a Plan into a plain object with toObject()', () => {
  const plan = mockFreePlan();
  const plainPlan = plan.toObject();

  expect(plainPlan).toEqual({
    id: plan.id,
    name: plan.name,
    priceEur: plan.priceEur,
    interval: plan.interval,
    features: plan.features,
    highlighted: plan.highlighted,
  });
});

it('round-trips a Plan through toObject() and from()', () => {
  const original = mockProPlan();
  const restored = Plan.from(original.toObject());

  expect(restored).toEqual(original);
});

it('provides a free plan mock with the expected features', () => {
  const plan = mockFreePlan();

  expect(plan.id).toEqual('free');
  expect(plan.priceEur).toEqual(0);
  expect(plan.features).toContain('30 AI-generated replies per month');
  expect(plan.features).toContain('Daily inbox summary');
  expect(plan.features).toContain('Basic email categorization');
});

it('provides a pro plan mock with the expected features', () => {
  const plan = mockProPlan();

  expect(plan.id).toEqual('pro');
  expect(plan.priceEur).toEqual(12);
  expect(plan.highlighted).toEqual(true);
  expect(plan.features).toContain('Unlimited AI replies');
  expect(plan.features).toContain('Smart inbox cleanup');
  expect(plan.features).toContain('Personalized writing style');
  expect(plan.features).toContain('Priority processing');
  expect(plan.features).toContain('Advanced filters');
});

it('provides both plans through mockPlans()', () => {
  const plans = mockPlans();

  expect(plans).toHaveLength(2);
  expect(plans.map((plan) => plan.id)).toEqual(['free', 'pro']);
});

it('supports partial overrides per plan id on mockPlans()', () => {
  const plans = mockPlans({ pro: { priceEur: 15 } });
  const pro = plans.find((plan) => plan.id === 'pro');

  expect(pro?.priceEur).toEqual(15);
});

it('defaults missing properties safely when deserializing', () => {
  // @ts-expect-error - testing defensive defaults for malformed input
  const plan = Plan.from({});

  expect(plan.id).toEqual('free');
  expect(plan.name).toEqual('');
  expect(plan.priceEur).toEqual(0);
  expect(plan.interval).toEqual('month');
  expect(plan.features).toEqual([]);
});
