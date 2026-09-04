import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Email, type PlainEmail } from '@lov/mail.entities.email';
import { EMAIL_DETAIL_FIELDS } from './email-fragments.js';

const GET_EMAIL_QUERY = gql`
  query GetEmail($id: ID!) {
    getEmail(id: $id) {
      ...EmailDetailFields
    }
  }
  ${EMAIL_DETAIL_FIELDS}
`;

export type UseEmailOptions = {
  /**
   * provide mock data to bypass the network request entirely, useful
   * for tests and compositions.
   */
  mockData?: Email;
};

export type UseEmailResult = {
  /**
   * the requested email, including its full body, once loaded.
   */
  email?: Email;

  /**
   * whether the email is currently being fetched.
   */
  loading: boolean;

  /**
   * error raised while fetching the email, if any.
   */
  error?: Error;

  /**
   * re-runs the query against the server.
   */
  refetch: () => void;
};

/**
 * fetches a single email by id, including its full body, for the
 * reading pane.
 */
export function useEmail(id: string, options?: UseEmailOptions): UseEmailResult {
  const { mockData } = options || {};

  const { data, loading, error, refetch } = useQuery<{ getEmail: PlainEmail | null }>(GET_EMAIL_QUERY, {
    variables: { id },
    skip: Boolean(mockData) || !id,
  });

  const email = useMemo(() => {
    if (mockData) return mockData;
    return data?.getEmail ? Email.from(data.getEmail) : undefined;
  }, [mockData, data]);

  return {
    email,
    loading: mockData ? false : loading,
    error: mockData ? undefined : error,
    refetch: () => {
      if (!mockData) refetch();
    },
  };
}
