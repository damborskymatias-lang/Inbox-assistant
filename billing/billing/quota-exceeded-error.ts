/**
 * thrown when a user tries to generate an AI reply after the monthly quota of their
 * plan has been exhausted. The message is written so the UI can surface it directly
 * inside an upgrade prompt.
 */
export class QuotaExceededError extends Error {
  constructor(
    /**
     * number of AI replies already used in the current billing period.
     */
    readonly used: number,

    /**
     * maximum number of AI replies allowed in the current billing period.
     */
    readonly limit: number
  ) {
    super(
      `You've used all ${limit} AI replies included in your Free plan this month. Upgrade to Pro for unlimited AI replies.`
    );

    this.name = 'QuotaExceededError';
  }

  /**
   * code the UI can match on to render the upgrade prompt.
   */
  readonly code = 'BILLING_QUOTA_EXCEEDED';
}
