import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type { ApolloCache } from '@apollo/client';

const ARCHIVE_EMAILS_MUTATION = gql`
  mutation ArchiveEmails($options: ArchiveEmailsOptions) {
    archiveEmails(options: $options) {
      affected
    }
  }
`;

export type ArchiveEmailsResult = {
  __typename?: string;
  affected: number;
};

export type UseArchiveEmailsResult = {
  /**
   * archives the emails with the given ids, updating the Apollo cache
   * optimistically so archived emails disappear instantly.
   */
  archiveEmails: (ids: string[]) => Promise<ArchiveEmailsResult | undefined>;

  /**
   * whether the mutation is currently in flight.
   */
  loading: boolean;

  /**
   * error raised while archiving the emails, if any.
   */
  error?: Error;
};

/**
 * archives one or more emails by id. the cache is updated optimistically,
 * flipping each email's archived flag before the server responds.
 */
export function useArchiveEmails(): UseArchiveEmailsResult {
  const [archiveEmailsMutation, { loading, error }] = useMutation<{ archiveEmails: ArchiveEmailsResult }>(
    ARCHIVE_EMAILS_MUTATION
  );

  const archiveEmails = async (ids: string[]) => {
    const result = await archiveEmailsMutation({
      variables: { options: { ids } },
      optimisticResponse: {
        archiveEmails: {
          __typename: 'EmailActionResult',
          affected: ids.length,
        },
      },
      update: (cache: ApolloCache) => {
        ids.forEach((id) => {
          const cacheId = cache.identify({ __typename: 'Email', id });
          if (!cacheId) return;
          cache.modify({
            id: cacheId,
            fields: {
              archived: () => true,
            },
          });
        });
      },
    });

    return result.data?.archiveEmails;
  };

  return { archiveEmails, loading, error };
}
