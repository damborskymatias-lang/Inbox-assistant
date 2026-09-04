import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_TRIAGE_COUNTS_QUERY = gql`
  query GetTriageCounts {
    getTriageCounts {
      urgent
      needsReply
      fyi
      promotions
      total
    }
  }
`;

/**
 * counts of emails per triage bucket, used by the dashboard tiles.
 */
export type TriageCounts = {
  urgent: number;
  needsReply: number;
  fyi: number;
  promotions: number;
  total: number;
};

export type UseTriageCountsOptions = {
  /**
   * provide mock data to bypass the network request entirely, useful
   * for tests and compositions.
   */
  mockData?: TriageCounts;
};

export type UseTriageCountsResult = {
  /**
   * counts per triage bucket, once loaded.
   */
  counts?: TriageCounts;

  /**
   * whether the counts are currently being fetched.
   */
  loading: boolean;

  /**
   * error raised while fetching the counts, if any.
   */
  error?: Error;

  /**
   * re-runs the query against the server.
   */
  refetch: () => void;
};

/**
 * fetches the triage counts shown on the dashboard tiles (urgent,
 * needs reply, fyi and promotions).
 */
export function useTriageCounts(options?: UseTriageCountsOptions): UseTriageCountsResult {
  const { mockData } = options || {};

  const { data, loading, error, refetch } = useQuery<{ getTriageCounts: TriageCounts | null }>(
    GET_TRIAGE_COUNTS_QUERY,
    {
      skip: Boolean(mockData),
    }
  );

  const counts = useMemo(() => {
    if (mockData) return mockData;
    return data?.getTriageCounts || undefined;
  }, [mockData, data]);

  return {
    counts,
    loading: mockData ? false : loading,
    error: mockData ? undefined : error,
    refetch: () => {
      if (!mockData) refetch();
    },
  };
}
