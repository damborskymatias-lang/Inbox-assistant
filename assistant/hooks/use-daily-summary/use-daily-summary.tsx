import { useMemo, useCallback } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { DailySummary, PlainDailySummary } from '@lov/assistant.entities.daily-summary';

/**
 * GraphQL query fetching today's AI generated daily summary.
 */
export const GET_DAILY_SUMMARY = gql`
  query GetDailySummary {
    getDailySummary {
      id
      date
      totalNew
      greeting
      highlights
      suggestedActions {
        label
        emailId
        kind
      }
    }
  }
`;

type GetDailySummaryData = {
  getDailySummary?: Omit<PlainDailySummary, 'userId'> | null;
};

export type UseDailySummaryOptions = {
  /**
   * mock daily summary data used instead of executing the GraphQL query, useful for testing.
   */
  mockData?: PlainDailySummary;
};

export type UseDailySummaryResult = {
  /**
   * today's AI generated daily summary, when available.
   */
  summary?: DailySummary;

  /**
   * whether the summary is currently being fetched.
   */
  loading: boolean;

  /**
   * error message, when the query failed.
   */
  error?: string;

  /**
   * re-fetches the daily summary, used to regenerate it after new emails were analyzed.
   */
  regenerate: () => void;
};

/**
 * fetches today's AI generated daily summary for the signed-in user's inbox.
 * accepts an optional mock daily summary to support testing without a live GraphQL server.
 */
export function useDailySummary(options?: UseDailySummaryOptions): UseDailySummaryResult {
  const mockData = options?.mockData;

  const { data, loading, error, refetch } = useQuery<GetDailySummaryData>(GET_DAILY_SUMMARY, {
    skip: Boolean(mockData),
  });

  const summary = useMemo(() => {
    if (mockData) return DailySummary.from(mockData);
    if (!data?.getDailySummary) return undefined;

    return DailySummary.from({
      userId: '',
      highlights: [],
      suggestedActions: [],
      ...data.getDailySummary,
    });
  }, [data, mockData]);

  const regenerate = useCallback(() => {
    if (mockData) return;
    refetch();
  }, [mockData, refetch]);

  return {
    summary,
    loading: mockData ? false : loading,
    error: mockData ? undefined : error?.message,
    regenerate,
  };
}
