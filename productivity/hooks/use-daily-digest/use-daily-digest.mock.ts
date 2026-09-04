import { mockDailyDigest, mockWeeklyDigests } from '@lov/productivity.entities.daily-digest';
import type { PlainDigestPreferences } from '@lov/productivity.entities.daily-digest';

/**
 * mock today's digest, matching the AI daily summary numbers used in the
 * inbox prototype.
 */
export const mockTodayDigest = () => mockDailyDigest().toObject();

/**
 * mock a week of digests (oldest to newest), used to power the trend view.
 */
export const mockDigestHistory = () => mockWeeklyDigests().map((digest) => digest.toObject());

/**
 * mock notification preferences for the digest settings panel.
 */
export const mockDigestPreferences = (): PlainDigestPreferences => ({
  enabled: true,
  channel: 'email',
  timeOfDay: '08:00',
});
