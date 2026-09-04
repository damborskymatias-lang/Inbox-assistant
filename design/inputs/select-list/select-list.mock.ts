import type { SelectOption } from './select-option-type.js';

/**
 * Mock writing-style options used for previews and tests.
 */
export const writingStyleOptions: SelectOption[] = [
  { value: `professional`, label: `Professional` },
  { value: `friendly`, label: `Friendly` },
  { value: `concise`, label: `Concise` },
  { value: `casual`, label: `Casual` },
];

/**
 * Mock triage filter options used for previews and tests.
 */
export const triageFilterOptions: SelectOption[] = [
  { value: `all`, label: `All email` },
  { value: `urgent`, label: `Urgent` },
  { value: `needsReply`, label: `Needs Reply` },
  { value: `fyi`, label: `FYI` },
  { value: `promotions`, label: `Promotions` },
];

/**
 * Mock cleanup rule options used for previews and tests.
 */
export const cleanupRuleOptions: SelectOption[] = [
  { value: `archive-newsletters`, label: `Archive newsletters` },
  { value: `archive-read`, label: `Archive read emails` },
  { value: `archive-promotions`, label: `Archive promotions` },
  { value: `delete-older-90`, label: `Delete emails older than 90 days` },
];
