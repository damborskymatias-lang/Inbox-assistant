/**
 * thrown when a user asks for another AI reply after the daily generation quota of
 * their plan has been used up. the message mentions the quota explicitly so the UI
 * can surface it inside an upgrade prompt.
 */
export class QuotaExceededError extends Error {
  constructor(
    /**
     * amount of AI replies already generated in the current period.
     */
    readonly used: number,

    /**
     * maximum amount of AI replies allowed in the current period.
     */
    readonly limit: number
  ) {
    super(
      `You've used all ${limit} AI replies included in your plan today. Upgrade to Pro for unlimited AI replies.`
    );

    this.name = 'QuotaExceededError';
  }

  /**
   * code the UI matches on to render the upgrade prompt.
   */
  readonly code = 'QUOTA_EXCEEDED';
}
