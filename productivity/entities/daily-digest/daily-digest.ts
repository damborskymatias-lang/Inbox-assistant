/**
 * Kind of action tracked by the AI inbox assistant, used to compute
 * minutes saved per action.
 */
export type ActionKind = 'reply_sent' | 'cleanup' | 'triage' | 'summary_read';

/**
 * Default minutes saved per action kind. `cleanup` is expressed per
 * cleaned email, all other kinds are a flat per-action value.
 */
export const DEFAULT_MINUTES_SAVED: Record<ActionKind, number> = {
  reply_sent: 4,
  cleanup: 0.2,
  triage: 0.5,
  summary_read: 6,
};

/**
 * Plain, serializable representation of a TrackedAction.
 */
export type PlainTrackedAction = {
  /**
   * kind of action performed by the user.
   */
  kind: ActionKind;

  /**
   * number of items the action applied to, e.g. emails cleaned.
   */
  count?: number;

  /**
   * total minutes saved by this action.
   */
  minutesSaved: number;

  /**
   * optional reference to the related entity, e.g. an email id.
   */
  ref?: string;

  /**
   * ISO timestamp of when the action occurred.
   */
  occurredAt: string;
};

/**
 * A single action performed (or triggered) by the AI inbox assistant on
 * behalf of the user, used to compute the daily digest metrics.
 */
export class TrackedAction {
  constructor(
    /**
     * kind of action performed by the user.
     */
    readonly kind: ActionKind,

    /**
     * total minutes saved by this action.
     */
    readonly minutesSaved: number,

    /**
     * ISO timestamp of when the action occurred.
     */
    readonly occurredAt: string,

    /**
     * number of items the action applied to, e.g. emails cleaned.
     */
    readonly count?: number,

    /**
     * optional reference to the related entity, e.g. an email id.
     */
    readonly ref?: string
  ) {}

  /**
   * compute the default minutes saved for a given action kind and count.
   */
  static defaultMinutesSaved(kind: ActionKind, count = 1): number {
    const perUnit = DEFAULT_MINUTES_SAVED[kind] ?? 0;
    return kind === 'cleanup' ? perUnit * count : perUnit;
  }

  /**
   * serialize the TrackedAction into a plain object.
   */
  toObject(): PlainTrackedAction {
    return {
      kind: this.kind,
      count: this.count,
      minutesSaved: this.minutesSaved,
      ref: this.ref,
      occurredAt: this.occurredAt,
    };
  }

  /**
   * create a TrackedAction instance from a plain object.
   */
  static from(plainAction: PlainTrackedAction): TrackedAction {
    const {
      kind = 'triage',
      count = undefined,
      minutesSaved = TrackedAction.defaultMinutesSaved(kind, count),
      ref = undefined,
      occurredAt = new Date().toISOString(),
    } = plainAction || ({} as PlainTrackedAction);

    return new TrackedAction(kind, minutesSaved, occurredAt, count, ref);
  }
}

/**
 * Delivery channel used to notify the user about their daily digest.
 */
export type DigestChannel = 'email' | 'push' | 'none';

/**
 * Plain, serializable representation of DigestPreferences.
 */
export type PlainDigestPreferences = {
  /**
   * whether the daily digest notification is enabled.
   */
  enabled: boolean;

  /**
   * channel used to deliver the digest.
   */
  channel: DigestChannel;

  /**
   * time of day (HH:mm, 24h) the digest is sent.
   */
  timeOfDay: string;
};

/**
 * User preferences controlling when and how the daily digest
 * notification is delivered.
 */
export class DigestPreferences {
  constructor(
    /**
     * whether the daily digest notification is enabled.
     */
    readonly enabled: boolean,

    /**
     * channel used to deliver the digest.
     */
    readonly channel: DigestChannel,

    /**
     * time of day (HH:mm, 24h) the digest is sent.
     */
    readonly timeOfDay: string
  ) {}

  /**
   * serialize the DigestPreferences into a plain object.
   */
  toObject(): PlainDigestPreferences {
    return {
      enabled: this.enabled,
      channel: this.channel,
      timeOfDay: this.timeOfDay,
    };
  }

  /**
   * create a DigestPreferences instance from a plain object.
   */
  static from(plainPreferences: PlainDigestPreferences): DigestPreferences {
    const {
      enabled = true,
      channel = 'email',
      timeOfDay = '08:00',
    } = plainPreferences || ({} as PlainDigestPreferences);

    return new DigestPreferences(enabled, channel, timeOfDay);
  }
}

/**
 * Plain, serializable representation of a DailyDigest.
 */
export type PlainDailyDigest = {
  /**
   * unique identifier of the digest.
   */
  id: string;

  /**
   * id of the user this digest belongs to.
   */
  userId: string;

  /**
   * ISO date (YYYY-MM-DD) the digest covers.
   */
  date: string;

  /**
   * number of emails processed (triaged) by the assistant that day.
   */
  emailsProcessed: number;

  /**
   * number of replies sent with assistant help that day.
   */
  repliesSent: number;

  /**
   * number of emails cleaned up (archived/deleted) that day.
   */
  emailsCleaned: number;

  /**
   * total minutes saved that day across all tracked actions.
   */
  minutesSaved: number;
};

/**
 * DailyDigest entity summarizing a user's AI inbox assistant activity
 * for a single day, used to power the trend chart and digest notifications.
 */
export class DailyDigest {
  constructor(
    /**
     * unique identifier of the digest.
     */
    readonly id: string,

    /**
     * id of the user this digest belongs to.
     */
    readonly userId: string,

    /**
     * ISO date (YYYY-MM-DD) the digest covers.
     */
    readonly date: string,

    /**
     * number of emails processed (triaged) by the assistant that day.
     */
    readonly emailsProcessed: number,

    /**
     * number of replies sent with assistant help that day.
     */
    readonly repliesSent: number,

    /**
     * number of emails cleaned up (archived/deleted) that day.
     */
    readonly emailsCleaned: number,

    /**
     * total minutes saved that day across all tracked actions.
     */
    readonly minutesSaved: number
  ) {}

  /**
   * serialize the DailyDigest into a plain object.
   */
  toObject(): PlainDailyDigest {
    return {
      id: this.id,
      userId: this.userId,
      date: this.date,
      emailsProcessed: this.emailsProcessed,
      repliesSent: this.repliesSent,
      emailsCleaned: this.emailsCleaned,
      minutesSaved: this.minutesSaved,
    };
  }

  /**
   * create a DailyDigest instance from a plain object.
   */
  static from(plainDigest: PlainDailyDigest): DailyDigest {
    const {
      id = '',
      userId = '',
      date = new Date().toISOString().slice(0, 10),
      emailsProcessed = 0,
      repliesSent = 0,
      emailsCleaned = 0,
      minutesSaved = 0,
    } = plainDigest || ({} as PlainDailyDigest);

    return new DailyDigest(id, userId, date, emailsProcessed, repliesSent, emailsCleaned, minutesSaved);
  }
}
