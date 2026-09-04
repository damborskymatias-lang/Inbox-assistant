/**
 * Kind of a suggested first action for the day.
 */
export type SuggestedActionKind = 'reply' | 'verify' | 'archive' | 'review' | 'other';

/**
 * A single AI suggested first action.
 */
export type SuggestedAction = {
  /**
   * label shown to the user, e.g. "Reply to John".
   */
  label: string;

  /**
   * id of the email this action relates to, when applicable.
   */
  emailId?: string;

  /**
   * kind of action to perform.
   */
  kind: SuggestedActionKind;
};

/**
 * plain representation of a DailySummary, used for
 * serialization and de-serialization.
 */
export type PlainDailySummary = {
  /**
   * unique id of the daily summary.
   */
  id: string;

  /**
   * id of the user this summary was generated for.
   */
  userId: string;

  /**
   * date the summary was generated for, in ISO format.
   */
  date: string;

  /**
   * total number of new emails since the last summary.
   */
  totalNew: number;

  /**
   * AI generated greeting shown at the top of the summary.
   */
  greeting: string;

  /**
   * AI generated highlights of what matters in the inbox.
   */
  highlights: string[];

  /**
   * AI suggested first actions for the day.
   */
  suggestedActions: SuggestedAction[];
};

/**
 * DailySummary entity, the AI generated daily digest of a user's inbox.
 */
export class DailySummary {
  constructor(
    /**
     * unique id of the daily summary.
     */
    readonly id: string,

    /**
     * id of the user this summary was generated for.
     */
    readonly userId: string,

    /**
     * date the summary was generated for, in ISO format.
     */
    readonly date: string,

    /**
     * total number of new emails since the last summary.
     */
    readonly totalNew: number,

    /**
     * AI generated greeting shown at the top of the summary.
     */
    readonly greeting: string,

    /**
     * AI generated highlights of what matters in the inbox.
     */
    readonly highlights: string[] = [],

    /**
     * AI suggested first actions for the day.
     */
    readonly suggestedActions: SuggestedAction[] = []
  ) {}

  /**
   * serialize a DailySummary into a plain object.
   */
  toObject(): PlainDailySummary {
    return {
      id: this.id,
      userId: this.userId,
      date: this.date,
      totalNew: this.totalNew,
      greeting: this.greeting,
      highlights: [...this.highlights],
      suggestedActions: this.suggestedActions.map((action) => ({ ...action })),
    };
  }

  /**
   * create a DailySummary instance from a plain object.
   */
  static from(plainDailySummary: PlainDailySummary) {
    const {
      id,
      userId,
      date,
      totalNew = 0,
      greeting = '',
      highlights = [],
      suggestedActions = [],
    } = plainDailySummary;

    return new DailySummary(id, userId, date, totalNew, greeting, highlights, suggestedActions);
  }
}
