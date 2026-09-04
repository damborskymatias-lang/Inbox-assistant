/**
 * The type of cleanup action a suggestion recommends.
 */
export type CleanupAction = 'archive' | 'delete';

/**
 * Plain object representation of a CleanupSuggestion.
 */
export type PlainCleanupSuggestion = {
  /**
   * unique identifier of the suggestion.
   */
  id: string;

  /**
   * name of the cleanup rule that generated this suggestion.
   */
  rule: string;

  /**
   * short human readable label, e.g. "42 newsletters detected".
   */
  label: string;

  /**
   * longer description of what the suggestion will do.
   */
  description: string;

  /**
   * number of emails affected by the suggestion.
   */
  count: number;

  /**
   * action recommended by the suggestion.
   */
  action: CleanupAction;

  /**
   * estimated minutes saved by applying the suggestion.
   */
  estimatedMinutesSaved: number;

  /**
   * whether this suggestion is only available on a pro plan.
   */
  pro: boolean;
};

/**
 * Result returned after executing a cleanup suggestion.
 */
export type CleanupResult = {
  /**
   * unique identifier of the suggestion that was executed.
   */
  id: string;

  /**
   * number of emails affected by the execution.
   */
  affected: number;

  /**
   * action that was performed.
   */
  action: CleanupAction;

  /**
   * minutes saved by performing the action.
   */
  minutesSaved: number;
};

/**
 * A CleanupSuggestion represents an AI generated recommendation
 * to archive or delete a group of emails, e.g. newsletters or
 * old promotional emails.
 */
export class CleanupSuggestion {
  constructor(
    /**
     * unique identifier of the suggestion.
     */
    readonly id: string,

    /**
     * name of the cleanup rule that generated this suggestion.
     */
    readonly rule: string,

    /**
     * short human readable label, e.g. "42 newsletters detected".
     */
    readonly label: string,

    /**
     * longer description of what the suggestion will do.
     */
    readonly description: string,

    /**
     * number of emails affected by the suggestion.
     */
    readonly count: number,

    /**
     * action recommended by the suggestion.
     */
    readonly action: CleanupAction,

    /**
     * estimated minutes saved by applying the suggestion.
     */
    readonly estimatedMinutesSaved: number,

    /**
     * whether this suggestion is only available on a pro plan.
     */
    readonly pro: boolean = false
  ) {}

  /**
   * serialize a CleanupSuggestion into a plain object.
   */
  toObject(): PlainCleanupSuggestion {
    return {
      id: this.id,
      rule: this.rule,
      label: this.label,
      description: this.description,
      count: this.count,
      action: this.action,
      estimatedMinutesSaved: this.estimatedMinutesSaved,
      pro: this.pro,
    };
  }

  /**
   * create a CleanupSuggestion instance from a plain object.
   */
  static from(plainCleanupSuggestion: PlainCleanupSuggestion): CleanupSuggestion {
    const {
      id,
      rule,
      label,
      description,
      count,
      action,
      estimatedMinutesSaved,
      pro = false,
    } = plainCleanupSuggestion || ({} as PlainCleanupSuggestion);

    return new CleanupSuggestion(id, rule, label, description, count, action, estimatedMinutesSaved, pro);
  }
}
