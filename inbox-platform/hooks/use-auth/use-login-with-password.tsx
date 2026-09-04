import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { User, type PlainUser } from '@lov/inbox-platform.entities.user';

/**
 * GraphQL mutation authenticating a user with an email and password.
 */
export const LOGIN_WITH_PASSWORD_MUTATION = gql`
  mutation LoginWithPassword($email: String, $password: String) {
    loginWithPassword(options: { email: $email, password: $password }) {
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

export type LoginWithPasswordPayload = {
  /**
   * the authenticated user, when the login succeeded.
   */
  user?: User;

  /**
   * session token issued for the authenticated user.
   */
  token?: string;
};

export type UseLoginWithPasswordValue = {
  /**
   * executes the loginWithPassword mutation with the given credentials.
   */
  loginWithPassword: (email: string, password: string) => Promise<LoginWithPasswordPayload>;

  /**
   * whether the mutation is in flight.
   */
  loading: boolean;

  /**
   * error raised while logging in with a password.
   */
  error?: Error;
};

/**
 * authenticates a user using an email and password combination.
 */
export function useLoginWithPassword(): UseLoginWithPasswordValue {
  const [mutate, { loading, error }] = useMutation<{
    loginWithPassword: { user?: PlainUser; token?: string };
  }>(LOGIN_WITH_PASSWORD_MUTATION);

  const loginWithPassword = async (
    email: string,
    password: string
  ): Promise<LoginWithPasswordPayload> => {
    const result = await mutate({ variables: { email, password } });
    const payload = result.data?.loginWithPassword;

    return {
      user: payload?.user ? User.from(payload.user) : undefined,
      token: payload?.token,
    };
  };

  return { loginWithPassword, loading, error };
}
