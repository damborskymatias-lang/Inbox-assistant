import { mockWeeklyDigests } from '@lov/productivity.entities.daily-digest';
import type { PlainDailyDigest } from '@lov/productivity.entities.daily-digest';

/**
 * user id of the seeded demo account, matching the demo user created
 * by the inbox platform aspect.
 */
export const DEMO_USER_ID = 'user-peter-novak';

/**
 * shape of a seeded digest document.
 */
export type SeedDigestDocument = {
  digestId: string;
  userId: string;
  date: string;
  emailsProcessed: number;
  repliesSent: number;
  emailsCleaned: number;
  minutesSaved: number;
};

/**
 * map a plain digest to its persisted document shape.
 */
function toDigestDocument(digest: PlainDailyDigest): SeedDigestDocument {
  return {
    digestId: digest.id,
    userId: digest.userId,
    date: digest.date,
    emailsProcessed: digest.emailsProcessed,
    repliesSent: digest.repliesSent,
    emailsCleaned: digest.emailsCleaned,
    minutesSaved: digest.minutesSaved,
  };
}

/**
 * build a week of demo digest history (oldest to newest, ending today)
 * so the productivity trend is populated on a fresh database.
 */
export function buildDemoDigestHistory(userId: string = DEMO_USER_ID): SeedDigestDocument[] {
  return mockWeeklyDigests(userId).map((digest) => toDigestDocument(digest.toObject()));
}
