/**
 * configuration of the billing aspect.
 */
export type BillingConfig = {
  /**
   * number of AI replies included in the Free plan for a single billing period.
   */
  freeAiReplyLimit?: number;

  /**
   * effective ceiling of AI replies for the Pro plan. Pro is presented as unlimited,
   * the ceiling only exists so the quota can be represented as a number.
   */
  proAiReplyLimit?: number;

  /**
   * path of the public pricing page.
   */
  pricingPath?: string;

  /**
   * path of the protected billing page.
   */
  billingPath?: string;

  /**
   * seed the plan catalog and the demo user plans on a fresh database.
   */
  seedDemoPlans?: boolean;
};
