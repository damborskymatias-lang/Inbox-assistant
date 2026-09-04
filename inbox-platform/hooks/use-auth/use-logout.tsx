import { gql } from '@apollo/client';
import { useApolloClient, useMutation } from '@apollo/client/react';

/**
 * GraphQL mutation ending the current authenticated session.
 */
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export type UseLogoutValue = {
  /**
   * ends the current session and clears cached GraphQL data.
   */
  logout: () => Promise<void>;

  /**
   * whether the mutation is in flight.
   */
  loading: boolean;

  /**
   * error raised while logging out.
   */
  error?: Error;
};

/**
 * ends the current authenticated session and clears the Apollo cache,
 * regardless of whether the server mutation succeeds.
 */
export function useLogout(): UseLogoutValue {
  const client = useApolloClient();
  const [mutate, { loading, error }] = useMutation<{ logout: boolean }>(LOGOUT_MUTATION);

  const logout = async (): Promise<void> => {
    try {
      await mutate();
    } catch {
      // local session should still be cleared even if the network call fails.
    }

    await client.resetStore().catch(() => undefined);
  };

  return { logout, loading, error };
}
