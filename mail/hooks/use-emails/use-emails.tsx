import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Email, type PlainEmail } from '@lov/mail.entities.email';
import { EMAIL_SUMMARY_FIELDS } from './email-fragments.js';

const LIST_EMAILS_QUERY = gql`
  query ListEmails($options: ListEmailsOptions) {
    listEmails(options: $options) {
      ...EmailSummaryFields
    }
  }
  ${EMAIL_SUMMARY_FIELDS}
`;

export type UseEmailsOptions = {
  /**
   * filter emails by triage bucket (urgent, needsReply, fyi, promotions).
   */
  bucket?: string;

  /**
   * filter emails by smart category.
   */
  category?: string;

  /**
   * free text search across sender and subject.
   */
  search?: string;

  /**
   * only return unread emails when true.
   */
  unreadOnly?: boolean;

  /**
   * maximum number of emails to return.
   */
  limit?: number;

  /**
   * number of emails to skip, for pagination.
   */
  offset?: number;

  /**
   * provide mock data to bypass the network request entirely, useful
   * for tests and compositions.
   */
  mockData?: Email[];
};

export type UseEmailsResult = {
  /**
   * emails matching the given filters.
   */
  emails: Email[];

  /**
   * whether the emails are currently being fetched.
   */
  loading: boolean;

  /**
   * error raised while fetching the emails, if any.
   */
  error?: Error;

  /**
   * re-runs the query against the server.
   */
  refetch: () => void;
};

/**
 * fetches the list of emails for the inbox, optionally filtered by
 * triage bucket, category, search term or read state.
 */
export function useEmails(options?: UseEmailsOptions): UseEmailsResult {
  const { mockData, bucket, category, search, unreadOnly, limit, offset } = options || {};

  const { data, loading, error, refetch } = useQuery<{ listEmails: PlainEmail[] }>(LIST_EMAILS_QUERY, {
    variables: { options: { bucket, category, search, unreadOnly, limit, offset } },
    skip: Boolean(mockData),
  });

  const emails = useMemo(() => {
    if (mockData) return mockData;
    return (data?.listEmails || []).filter(Boolean).map((email) => Email.from(email));
  }, [mockData, data]);

  return {
    emails,
    loading: mockData ? false : loading,
    error: mockData ? undefined : error,
    refetch: () => {
      if (!mockData) refetch();
    },
  };
}
