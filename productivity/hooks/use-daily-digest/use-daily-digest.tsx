import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { DailyDigest, PlainDailyDigest } from '@lov/productivity.entities.daily-digest';

const GET_TODAY_DIGEST = gql`
  query GetTodayDigest {
    getTodayDigest {
      id
      date
      emailsProcessed
      repliesSent
      emailsCleaned
      minutesSaved
    }
  }
`;

/**
 * light poll interval (ms) used to keep the header indicator current
 * while the user works, without hammering the server.
 */
const DIGEST_POLL_INTERVAL_MS = 60000;

type TodayDigestFields = Pick<
  PlainDailyDigest,
  'id' | 'date' | 'emailsProcessed' | 'repliesSent' | 'emailsCleaned' | 'minutesSaved'
>;

export type UseDailyDigestOptions = {
  /**
   * provide mock digest data to skip the network request, useful for
   * compositions and tests.
   */
  mockData?: PlainDailyDigest;
};

export type UseDailyDigestResult = {
  /**
   * today's digest, or undefined while loading or when unavailable.
   */
  digest?: DailyDigest;

  /**
   * whether the digest is currently being fetched.
   */
  loading: boolean;

  /**
   * error message, if the digest could not be fetched.
   */
  error?: string;
};

/**
 * returns today's daily digest, lightly polling so the header indicator
 * stays current as the user works.
 */
export function useDailyDigest(options?: UseDailyDigestOptions): UseDailyDigestResult {
  const { data, loading, error } = useQuery<{ getTodayDigest: TodayDigestFields | null }>(GET_TODAY_DIGEST, {
    skip: Boolean(options?.mockData),
    pollInterval: DIGEST_POLL_INTERVAL_MS,
  });

  if (options?.mockData) {
    return {
      digest: DailyDigest.from(options.mockData),
      loading: false,
      error: undefined,
    };
  }

  const digest = data?.getTodayDigest ? DailyDigest.from({ ...data.getTodayDigest, userId: '' }) : undefined;

  return {
    digest,
    loading,
    error: error?.message,
  };
}
