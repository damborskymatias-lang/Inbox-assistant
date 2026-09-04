import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Plan, type PlainPlan } from '@lov/billing.entities.plan';

const LIST_PLANS_QUERY = gql`
  query ListPlans {
    listPlans {
      id
      name
      priceEur
      interval
      features
      highlighted
    }
  }
`;

export type UseListPlansOptions = {
  /**
   * provide mock data to skip the network request, useful for tests and compositions.
   */
  mockData?: PlainPlan[];
};

export type UseListPlansResult = {
  /**
   * the catalog of billing plans offered by the product.
   */
  plans: Plan[];

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
 * fetches the catalog of billing plans offered by the product (e.g. Free and Pro).
 */
export function useListPlans(options?: UseListPlansOptions): UseListPlansResult {
  const results = useQuery<{ listPlans: PlainPlan[] }>(LIST_PLANS_QUERY, {
    skip: Boolean(options?.mockData),
  });

  const data = options?.mockData ? { listPlans: options.mockData } : results.data;
  const loading = options?.mockData ? false : results.loading;
  const error = options?.mockData ? undefined : results.error?.message;

  const plans = useMemo(() => {
    return (data?.listPlans || []).filter(Boolean).map((plainPlan) => Plan.from(plainPlan));
  }, [data]);

  return {
    plans,
    loading,
    error,
  };
}
