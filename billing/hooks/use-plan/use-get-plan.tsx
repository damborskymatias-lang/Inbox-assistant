import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { UserPlan, type PlainUserPlan } from '@lov/billing.entities.plan';

const GET_PLAN_QUERY = gql`
  query GetPlan {
    getPlan {
      planId
      aiRepliesUsed
      aiRepliesLimit
      periodStart
      periodEnd
    }
  }
`;

export type UseGetPlanOptions = {
  /**
   * provide mock data to skip the network request, useful for tests and compositions.
   */
  mockData?: PlainUserPlan;
};

export type UseGetPlanResult = {
  /**
   * the current user's subscription and AI reply usage, if loaded.
   */
  userPlan?: UserPlan;

  /**
   * whether the query is in flight.
   */
  loading: boolean;

  /**
   * error message, if the query failed.
   */
  error?: string;
};

/**
 * fetches the current user's subscription plan and AI reply usage for the active billing period.
 */
export function useGetPlan(options?: UseGetPlanOptions): UseGetPlanResult {
  const results = useQuery<{ getPlan: PlainUserPlan }>(GET_PLAN_QUERY, {
    skip: Boolean(options?.mockData),
  });

  const data = options?.mockData ? { getPlan: options.mockData } : results.data;
  const loading = options?.mockData ? false : results.loading;
  const error = options?.mockData ? undefined : results.error?.message;

  const userPlan = useMemo(() => {
    return data?.getPlan ? UserPlan.from(data.getPlan) : undefined;
  }, [data]);

  return {
    userPlan,
    loading,
    error,
  };
}
