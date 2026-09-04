import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { DailyDigest, PlainDailyDigest } from '@lov/productivity.entities.daily-digest';

const LIST_DIGESTS = gql`
  query ListDigests($days: Int) {
    listDigests(options: { days: $days }) {
      id
      date
      emailsProcessed
      repliesSent
      emailsCleaned
      minutesSaved
    }
  }
`;

type DigestHistoryFields = Pick<
  PlainDailyDigest,
  'id' | 'date' | 'emailsProcessed' | 'repliesSent' | 'emailsCleaned' | 'minutesSaved'
>;

export type UseDigestHistoryOptions = {
  /**
   * provide mock digest history to skip the network request, useful for
   * compositions and tests.
   */
  mockData?: PlainDailyDigest[];
};

export type UseDigestHistoryResult = {
  /**
   * digests ordered oldest to newest, used to render the trend chart.
   */
  digests: DailyDigest[];

  /**
   * whether the digest history is currently being fetched.
   */
  loading: boolean;

  /**
   * error message, if the digest history could not be fetched.
   */
  error?: string;
};

/**
 * returns the digest history for the trailing `days` days, used to power
 * the productivity trend chart.
 */
export function useDigestHistory(days = 7, options?: UseDigestHistoryOptions): UseDigestHistoryResult {
  const { data, loading, error } = useQuery<{ listDigests: (DigestHistoryFields | null)[] }>(LIST_DIGESTS, {
    variables: { days },
    skip: Boolean(options?.mockData),
  });

  const digests = useMemo(() => {
    if (options?.mockData) {
      return options.mockData.map((digest) => DailyDigest.from(digest));
    }

    return (data?.listDigests || [])
      .filter((digest): digest is DigestHistoryFields => Boolean(digest))
      .map((digest) => DailyDigest.from({ ...digest, userId: '' }));
  }, [data, options?.mockData]);

  if (options?.mockData) {
    return {
      digests,
      loading: false,
      error: undefined,
    };
  }

  return {
    digests,
    loading,
    error: error?.message,
  };
}
