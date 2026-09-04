/**
 * unique identifier of a billing plan.
 */
export type PlanId = 'free' | 'pro';

/**
 * billing interval supported by a plan.
 */
export type PlanInterval = 'month';

/**
 * Plain, serializable representation of a Plan.
 */
export type PlainPlan = {
  /**
   * unique identifier of the plan.
   */
  id: PlanId;

  /**
   * display name of the plan.
   */
  name: string;

  /**
   * price of the plan, in euros.
   */
  priceEur: number;

  /**
   * billing interval of the plan.
   */
  interval: PlanInterval;

  /**
   * list of feature descriptions included in the plan.
   */
  features: string[];

  /**
   * whether the plan should be visually highlighted, e.g. on a pricing page.
   */
  highlighted?: boolean;
};

/**
 * Plan entity, describing a subscription tier offered by the product.
 */
export class Plan {
  constructor(
    /**
     * unique identifier of the plan.
     */
    readonly id: PlanId,

    /**
     * display name of the plan.
     */
    readonly name: string,

    /**
     * price of the plan, in euros.
     */
    readonly priceEur: number,

    /**
     * billing interval of the plan.
     */
    readonly interval: PlanInterval,

    /**
     * list of feature descriptions included in the plan.
     */
    readonly features: string[],

    /**
     * whether the plan should be visually highlighted, e.g. on a pricing page.
     */
    readonly highlighted?: boolean
  ) {}

  /**
   * serialize the Plan into a plain object.
   */
  toObject(): PlainPlan {
    return {
      id: this.id,
      name: this.name,
      priceEur: this.priceEur,
      interval: this.interval,
      features: this.features,
      highlighted: this.highlighted,
    };
  }

  /**
   * create a Plan instance from a plain object.
   */
  static from(plainPlan: PlainPlan): Plan {
    const {
      id = 'free',
      name = '',
      priceEur = 0,
      interval = 'month',
      features = [],
      highlighted = undefined,
    } = plainPlan || {};

    return new Plan(id, name, priceEur, interval, features, highlighted);
  }
}
