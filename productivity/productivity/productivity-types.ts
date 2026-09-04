import type { ActionKind } from '@lov/productivity.entities.daily-digest';

/**
 * options describing a single time saving action performed by the
 * AI inbox assistant on behalf of the user.
 */
export type TrackActionOptions = {
  /**
   * kind of action performed, used to derive the digest counters.
   */
  kind: ActionKind;

  /**
   * minutes saved by the action. when omitted, the default value of the
   * action kind is used.
   */
  minutesSaved?: number;

  /**
   * number of items the action applied to, e.g. emails cleaned.
   */
  count?: number;

  /**
   * optional reference to the related entity, e.g. an email id.
   */
  ref?: string;
};

/**
 * options for listing the digest history powering the trend chart.
 */
export type ListDigestsOptions = {
  /**
   * number of trailing days to return.
   */
  days?: number;
};

/**
 * options for updating the daily digest notification preferences.
 */
export type UpdateNotificationPreferencesOptions = {
  /**
   * whether the daily digest notification is enabled.
   */
  enabled?: boolean;

  /**
   * channel used to deliver the digest.
   */
  channel?: string;

  /**
   * time of day (HH:mm, 24h) the digest is sent.
   */
  timeOfDay?: string;
};

/**
 * counters accumulated into today's digest by a tracked action.
 */
export type DigestIncrements = {
  /**
   * number of emails processed (triaged) by the assistant.
   */
  emailsProcessed: number;

  /**
   * number of replies sent with assistant help.
   */
  repliesSent: number;

  /**
   * number of emails cleaned up (archived/deleted).
   */
  emailsCleaned: number;

  /**
   * minutes saved by the action.
   */
  minutesSaved: number;
};
