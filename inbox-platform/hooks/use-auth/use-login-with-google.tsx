import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { User, type PlainUser } from '@lov/inbox-platform.entities.user';

/**
 * GraphQL mutation exchanging a Google OAuth code for an authenticated session.
 */
export const LOGIN_WITH_GOOGLE_MUTATION = gql`
  mutation LoginWithGoogle($code: String) {
    loginWithGoogle(options: { code: $code }) {
      user {
        id
        email
        name
        avatarUrl
        createdAt
      }
      token
    }
  }
`;

export type LoginWithGooglePayload = {
  /**
   * the authenticated user, when the login succeeded.
   */
  user?: User;

  /**
   * session token issued for the authenticated user.
   */
  token?: string;
};

export type UseLoginWithGoogleValue = {
  /**
   * executes the loginWithGoogle mutation with an optional OAuth code.
   */
  loginWithGoogle: (code?: string) => Promise<LoginWithGooglePayload>;

  /**
   * whether the mutation is in flight.
   */
  loading: boolean;

  /**
   * error raised while logging in with Google.
   */
  error?: Error;
};

/**
 * authenticates the current visitor using a Google OAuth code.
 */
export function useLoginWithGoogle(): UseLoginWithGoogleValue {
  const [mutate, { loading, error }] = useMutation<{
    loginWithGoogle: { user?: PlainUser; token?: string };
  }>(LOGIN_WITH_GOOGLE_MUTATION);

  const loginWithGoogle = async (code?: string): Promise<LoginWithGooglePayload> => {
    const result = await mutate({ variables: { code } });
    const payload = result.data?.loginWithGoogle;

    return {
      user: payload?.user ? User.from(payload.user) : undefined,
      token: payload?.token,
    };
  };

  return { loginWithGoogle, loading, error };
}
