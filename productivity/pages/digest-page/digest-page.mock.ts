import { mockUser } from '@lov/inbox-platform.entities.user';
import { mockDailyDigest, mockWeeklyDigests } from '@lov/productivity.entities.daily-digest';
import type { PlainDigestPreferences } from '@lov/productivity.entities.daily-digest';

/**
 * mock the signed-in user shown on the digest page.
 */
export const mockDigestPageUser = () => mockUser({ name: `Peter Novak` });

/**
 * mock today's digest, matching the ~24 minutes saved headline.
 */
export const mockTodayDigest = () => mockDailyDigest({ minutesSaved: 24.4 }).toObject();

/**
 * mock a week of digests (oldest to newest), used to power the trend chart.
 */
export const mockDigestHistory = () => mockWeeklyDigests().map((digest) => digest.toObject());

/**
 * mock notification preferences for the digest settings panel.
 */
export const mockDigestPreferences = (): PlainDigestPreferences => ({
  enabled: true,
  channel: `email`,
  timeOfDay: `08:00`,
});
