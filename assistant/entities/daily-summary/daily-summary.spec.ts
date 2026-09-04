import { DailySummary } from './daily-summary.js';
import { mockDailySummary, mockDailySummaries } from './daily-summary.mock.js';

it('has a DailySummary.from() method', () => {
  expect(DailySummary.from).toBeTruthy();
});

it('creates a DailySummary from a plain object', () => {
  const summary = DailySummary.from({
    id: 'summary-1',
    userId: 'user-peter-novak',
    date: '2024-05-01',
    totalNew: 38,
    greeting: 'Good morning, Peter 👋',
    highlights: ['Client is requesting a project update.'],
    suggestedActions: [{ label: 'Reply to John', emailId: 'e1', kind: 'reply' }],
  });

  expect(summary.id).toEqual('summary-1');
  expect(summary.totalNew).toEqual(38);
  expect(summary.highlights).toEqual(['Client is requesting a project update.']);
});

it('serializes a DailySummary back into a plain object with an id', () => {
  const summary = mockDailySummary();
  const plainObject = summary.toObject();

  expect(plainObject.id).toEqual(summary.id);
  expect(plainObject.userId).toEqual(summary.userId);
  expect(plainObject.highlights).toEqual(summary.highlights);
  expect(plainObject.suggestedActions).toEqual(summary.suggestedActions);
});

it('defaults missing optional properties safely', () => {
  const summary = DailySummary.from({
    id: 'summary-2',
    userId: 'user-peter-novak',
    date: '2024-05-01',
  } as any);

  expect(summary.totalNew).toEqual(0);
  expect(summary.highlights).toEqual([]);
  expect(summary.suggestedActions).toEqual([]);
});

it('mocks a DailySummary matching the prototype copy', () => {
  const summary = mockDailySummary();

  expect(summary.totalNew).toEqual(38);
  expect(summary.greeting).toContain('Peter');
  expect(summary.highlights).toEqual([
    'Client is requesting a project update.',
    'Your bank requires identity verification.',
    'Amazon package has been delayed.',
  ]);
  expect(summary.suggestedActions).toHaveLength(3);
  expect(summary.suggestedActions[0]).toEqual({ label: 'Reply to John', emailId: 'e1', kind: 'reply' });
});

it('supports partial overrides in the mock', () => {
  const summary = mockDailySummary({ totalNew: 5, greeting: 'Hi there' });

  expect(summary.totalNew).toEqual(5);
  expect(summary.greeting).toEqual('Hi there');
});

it('mocks a list of DailySummary entities', () => {
  const summaries = mockDailySummaries();

  expect(summaries).toHaveLength(2);
  summaries.forEach((summary) => expect(summary).toBeInstanceOf(DailySummary));
});
