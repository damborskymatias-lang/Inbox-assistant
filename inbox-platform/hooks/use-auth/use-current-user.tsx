import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { User, type PlainUser } from '@lov/inbox-platform.entities.user';

/**
 * GraphQL query fetching the currently authenticated user from the platform aspect.
 */
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      name
      avatarUrl
      createdAt
    }
  }
`;

export type UseCurrentUserOptions = {
  /**
   * mock data to bypass the network request, useful for tests and compositions.
   */
  mockData?: User;
};

export type UseCurrentUserValue = {
  /**
   * the currently authenticated user, or undefined when not signed in.
   */
  user?: User;

  /**
   * whether the current user request is in flight.
   */
  loading: boolean;

  /**
   * error raised while fetching the current user.
   */
  error?: Error;

  /**
   * re-fetch the current user from the server.
   */
  refetch: () => void;
};

/**
 * fetches and caches the currently authenticated user from the platform aspect.
 */
export function useCurrentUser(options?: UseCurrentUserOptions): UseCurrentUserValue {
  const results = useQuery<{ getCurrentUser: PlainUser | null }>(GET_CURRENT_USER, {
    skip: Boolean(options?.mockData),
  });

  const user = useMemo(() => {
    if (options?.mockData) return options.mockData;
    return results.data?.getCurrentUser ? User.from(results.data.getCurrentUser) : undefined;
  }, [options?.mockData, results.data]);

  const refetch = () => {
    if (options?.mockData) return;
    results.refetch();
  };

  return {
    user,
    loading: options?.mockData ? false : results.loading,
    error: options?.mockData ? undefined : results.error,
    refetch,
  };
}
