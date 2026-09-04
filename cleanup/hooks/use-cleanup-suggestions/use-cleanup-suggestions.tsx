import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { CleanupSuggestion, type PlainCleanupSuggestion } from '@lov/cleanup.entities.cleanup-suggestion';

/**
 * GraphQL query listing all cleanup suggestions generated for the current inbox.
 */
export const LIST_SUGGESTIONS_QUERY = gql`
  query ListSuggestions {
    listSuggestions {
      id
      rule
      label
      description
      count
      action
      estimatedMinutesSaved
      pro
    }
  }
`;

export type UseCleanupSuggestionsOptions = {
  /**
   * mock data to bypass the network request, useful for tests and compositions.
   */
  mockData?: CleanupSuggestion[];
};

export type UseCleanupSuggestionsValue = {
  /**
   * cleanup suggestions generated for the current inbox.
   */
  suggestions: CleanupSuggestion[];

  /**
   * whether the suggestions are currently being fetched.
   */
  loading: boolean;

  /**
   * error raised while fetching the suggestions.
   */
  error?: Error;

  /**
   * re-fetch the cleanup suggestions from the server.
   */
  refetch: () => void;
};

/**
 * fetches the cleanup suggestions generated for the current inbox, such as
 * grouped newsletters or aged promotional emails recommended for archiving
 * or deletion.
 */
export function useCleanupSuggestions(options?: UseCleanupSuggestionsOptions): UseCleanupSuggestionsValue {
  const results = useQuery<{ listSuggestions: PlainCleanupSuggestion[] }>(LIST_SUGGESTIONS_QUERY, {
    skip: Boolean(options?.mockData),
  });

  const suggestions = useMemo(() => {
    if (options?.mockData) return options.mockData;
    return (results.data?.listSuggestions || []).map(CleanupSuggestion.from);
  }, [options?.mockData, results.data]);

  const refetch = () => {
    if (options?.mockData) return;
    results.refetch();
  };

  return {
    suggestions,
    loading: options?.mockData ? false : results.loading,
    error: options?.mockData ? undefined : results.error,
    refetch,
  };
}
