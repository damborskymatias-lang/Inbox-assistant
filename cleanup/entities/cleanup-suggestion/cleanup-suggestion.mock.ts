import { CleanupSuggestion } from './cleanup-suggestion.js';
import type { PlainCleanupSuggestion } from './cleanup-suggestion.js';

/**
 * Create a mock CleanupSuggestion, optionally overriding any properties.
 */
export function mockCleanupSuggestion(
  overrides: Partial<PlainCleanupSuggestion> = {}
): CleanupSuggestion {
  return CleanupSuggestion.from({
    id: 'suggestion-newsletters',
    rule: 'newsletters',
    label: '42 newsletters detected',
    description: 'Newsletters and promotions from the last 30 days.',
    count: 42,
    action: 'archive',
    estimatedMinutesSaved: 24,
    pro: false,
    ...overrides,
  });
}

/**
 * Mock list of cleanup suggestions matching the inbox prototype.
 */
export function mockCleanupSuggestions(): CleanupSuggestion[] {
  return [
    mockCleanupSuggestion(),
    mockCleanupSuggestion({
      id: 'suggestion-promotions',
      rule: 'old-promotions',
      label: 'Delete promotional emails older than 30 days',
      description: 'Promotional emails that are more than 30 days old and unlikely to be needed.',
      count: 87,
      action: 'delete',
      estimatedMinutesSaved: 15,
      pro: true,
    }),
  ];
}
