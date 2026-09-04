import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const SYNC_EMAILS_MUTATION = gql`
  mutation SyncEmails {
    syncEmails {
      synced
    }
  }
`;

export type SyncEmailsResult = {
  synced: number;
};

export type UseSyncEmailsResult = {
  /**
   * triggers a sync of the mailbox, refetching the inbox list and
   * triage counts once the server confirms new emails were synced.
   */
  syncEmails: () => Promise<SyncEmailsResult | undefined>;

  /**
   * whether the mutation is currently in flight.
   */
  loading: boolean;

  /**
   * error raised while syncing emails, if any.
   */
  error?: Error;
};

/**
 * triggers a sync of the connected mailbox. since the set of newly
 * synced emails is not known ahead of time, the inbox list and triage
 * counts queries are refetched once the sync completes so the UI stays
 * consistent.
 */
export function useSyncEmails(): UseSyncEmailsResult {
  const [syncEmailsMutation, { loading, error }] = useMutation<{ syncEmails: SyncEmailsResult }>(
    SYNC_EMAILS_MUTATION,
    {
      refetchQueries: ['ListEmails', 'GetTriageCounts'],
    }
  );

  const syncEmails = async () => {
    const result = await syncEmailsMutation();
    return result.data?.syncEmails;
  };

  return { syncEmails, loading, error };
}
