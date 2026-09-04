import { v4 as uuidv4 } from 'uuid';
import { DailySummary } from './daily-summary.js';
import type { PlainDailySummary, SuggestedAction } from './daily-summary.js';

const defaultHighlights = [
  'Client is requesting a project update.',
  'Your bank requires identity verification.',
  'Amazon package has been delayed.',
];

const defaultSuggestedActions: SuggestedAction[] = [
  { label: 'Reply to John', emailId: 'e1', kind: 'reply' },
  { label: 'Verify your bank account', emailId: 'e2', kind: 'verify' },
  { label: 'Archive newsletters', kind: 'archive' },
];

/**
 * create a single mock DailySummary, matching the prototype's copy,
 * supporting partial overrides of any property.
 */
export function mockDailySummary(overrides: Partial<PlainDailySummary> = {}) {
  return DailySummary.from({
    id: uuidv4(),
    userId: 'user-peter-novak',
    date: new Date().toISOString().slice(0, 10),
    totalNew: 38,
    greeting: 'Good morning, Peter 👋',
    highlights: [...defaultHighlights],
    suggestedActions: defaultSuggestedActions.map((action) => ({ ...action })),
    ...overrides,
  });
}

/**
 * create a list of mock DailySummary entities.
 */
export function mockDailySummaries() {
  return [
    mockDailySummary(),
    mockDailySummary({
      id: uuidv4(),
      date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
      totalNew: 12,
      greeting: 'Good afternoon, Peter 👋',
      highlights: ['Lena needs a decision on the contract liability clause.'],
      suggestedActions: [{ label: 'Reply to Lena', emailId: 'e4', kind: 'reply' }],
    }),
  ];
}
