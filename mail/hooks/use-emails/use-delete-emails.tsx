import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type { ApolloCache } from '@apollo/client';

const DELETE_EMAILS_MUTATION = gql`
  mutation DeleteEmails($options: DeleteEmailsOptions) {
    deleteEmails(options: $options) {
      affected
    }
  }
`;

export type DeleteEmailsResult = {
  __typename?: string;
  affected: number;
};

export type UseDeleteEmailsResult = {
  /**
   * deletes the emails with the given ids, evicting them from the
   * Apollo cache optimistically so they disappear instantly.
   */
  deleteEmails: (ids: string[]) => Promise<DeleteEmailsResult | undefined>;

  /**
   * whether the mutation is currently in flight.
   */
  loading: boolean;

  /**
   * error raised while deleting the emails, if any.
   */
  error?: Error;
};

/**
 * deletes one or more emails by id. the cache is updated optimistically,
 * evicting each email before the server confirms the deletion.
 */
export function useDeleteEmails(): UseDeleteEmailsResult {
  const [deleteEmailsMutation, { loading, error }] = useMutation<{ deleteEmails: DeleteEmailsResult }>(
    DELETE_EMAILS_MUTATION
  );

  const deleteEmails = async (ids: string[]) => {
    const result = await deleteEmailsMutation({
      variables: { options: { ids } },
      optimisticResponse: {
        deleteEmails: {
          __typename: 'EmailActionResult',
          affected: ids.length,
        },
      },
      update: (cache: ApolloCache) => {
        ids.forEach((id) => {
          const cacheId = cache.identify({ __typename: 'Email', id });
          if (!cacheId) return;
          cache.evict({ id: cacheId });
        });
        cache.gc();
      },
    });

    return result.data?.deleteEmails;
  };

  return { deleteEmails, loading, error };
}
