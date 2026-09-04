import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { UserPlan, type PlainUserPlan, type PlanId } from '@lov/billing.entities.plan';

const CHANGE_PLAN_MUTATION = gql`
  mutation ChangePlan($planId: String!) {
    changePlan(options: { planId: $planId }) {
      planId
      aiRepliesUsed
      aiRepliesLimit
      periodStart
      periodEnd
    }
  }
`;

export type UseChangePlanResult = {
  /**
   * switch the current user to the given plan id.
   */
  changePlan: (planId: PlanId) => Promise<UserPlan | undefined>;

  /**
   * the updated user plan, once the mutation resolved.
   */
  userPlan?: UserPlan;

  /**
   * whether the mutation is in flight.
   */
  loading: boolean;

  /**
   * error message, if the mutation failed.
   */
  error?: string;
};

/**
 * changes the current user's billing plan.
 */
export function useChangePlan(): UseChangePlanResult {
  const [changePlanMutation, { data, loading, error }] = useMutation<
    { changePlan: PlainUserPlan },
    { planId: string }
  >(CHANGE_PLAN_MUTATION);

  const changePlan = async (planId: PlanId) => {
    const result = await changePlanMutation({ variables: { planId } });
    return result.data?.changePlan ? UserPlan.from(result.data.changePlan) : undefined;
  };

  return {
    changePlan,
    userPlan: data?.changePlan ? UserPlan.from(data.changePlan) : undefined,
    loading,
    error: error?.message,
  };
}
