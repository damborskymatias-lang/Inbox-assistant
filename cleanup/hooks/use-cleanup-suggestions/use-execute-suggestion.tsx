import { gql } from '@apollo/client';
import { useApolloClient, useMutation } from '@apollo/client/react';
import type { CleanupResult, CleanupAction } from '@lov/cleanup.entities.cleanup-suggestion';

type PlainCleanupResult = {
  id: string;
  affected: number;
  action: CleanupAction;
  minutesSaved: number;
};

/**
 * GraphQL mutation executing a cleanup suggestion, applying its action
 * (archive or delete) to the affected emails.
 */
export const EXECUTE_SUGGESTION_MUTATION = gql`
  mutation ExecuteSuggestion($id: String) {
    executeSuggestion(options: { id: $id }) {
      id
      affected
      action
      minutesSaved
    }
  }
`;

export type UseExecuteSuggestionValue = {
  /**
   * executes the cleanup suggestion with the given id.
   */
  executeSuggestion: (id: string) => Promise<CleanupResult | undefined>;

  /**
   * whether the mutation is in flight.
   */
  loading: boolean;

  /**
   * error raised while executing the suggestion.
   */
  error?: Error;
};

/**
 * executes a cleanup suggestion, applying its archive or delete action to the
 * affected emails. On success it refreshes both the list of cleanup
 * suggestions and the mail triage counts held in the Apollo cache, so the
 * dashboard reflects the cleaned up inbox immediately.
 */
export function useExecuteSuggestion(): UseExecuteSuggestionValue {
  const client = useApolloClient();
  const [mutate, { loading, error }] = useMutation<{ executeSuggestion: PlainCleanupResult | null }>(
    EXECUTE_SUGGESTION_MUTATION
  );

  const executeSuggestion = async (id: string): Promise<CleanupResult | undefined> => {
    const result = await mutate({ variables: { id } });
    const executed = result.data?.executeSuggestion;

    await client.refetchQueries({ include: 'active' });

    return executed
      ? {
          id: executed.id,
          affected: executed.affected,
          action: executed.action,
          minutesSaved: executed.minutesSaved,
        }
      : undefined;
  };

  return { executeSuggestion, loading, error };
}
