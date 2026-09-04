import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

/**
 * GraphQL mutation triggering a batch classification of the inbox.
 */
export const ANALYZE_INBOX_MUTATION = gql`
  mutation AnalyzeInbox {
    analyzeInbox {
      analyzed
    }
  }
`;

/**
 * result of a batch inbox analysis.
 */
export type AnalyzeInboxAnalysis = {
  /**
   * number of emails that were analyzed by the AI classifier.
   */
  analyzed: number;
};

type AnalyzeInboxData = {
  analyzeInbox?: AnalyzeInboxAnalysis | null;
};

export type UseAnalyzeInboxResult = {
  /**
   * triggers the batch classification of the inbox, resolving with the analysis result.
   */
  analyzeInbox: () => Promise<AnalyzeInboxAnalysis | undefined>;

  /**
   * result of the last batch inbox analysis, when available.
   */
  analysis?: AnalyzeInboxAnalysis;

  /**
   * whether the mutation is currently in flight.
   */
  loading: boolean;

  /**
   * error message, when the mutation failed.
   */
  error?: string;
};

/**
 * triggers a batch classification of the inbox, analyzing every unread email
 * with the AI classifier so the daily summary can be regenerated.
 */
export function useAnalyzeInbox(): UseAnalyzeInboxResult {
  const [runMutation, { data, loading, error }] = useMutation<AnalyzeInboxData>(
    ANALYZE_INBOX_MUTATION
  );

  const analyzeInbox = async () => {
    const result = await runMutation();
    return result.data?.analyzeInbox ?? undefined;
  };

  return {
    analyzeInbox,
    analysis: data?.analyzeInbox ?? undefined,
    loading,
    error: error?.message,
  };
}
