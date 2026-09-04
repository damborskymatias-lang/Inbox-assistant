import { useState } from 'react';
import { User } from '@lov/inbox-platform.entities.user';
import { useCurrentUser } from './use-current-user.js';
import { useLoginWithGoogle } from './use-login-with-google.js';
import { useLoginWithPassword } from './use-login-with-password.js';
import { useLogout } from './use-logout.js';

export type UseAuthOptions = {
  /**
   * mock user to bypass the current user network request, useful for tests and compositions.
   */
  mockData?: User;
};

/**
 * shape of the value returned by the useAuth hook.
 */
export type UseAuthValue = {
  /**
   * the currently authenticated user, or undefined when signed out.
   */
  user?: User;

  /**
   * whether the current user is being resolved or an auth mutation is in flight.
   */
  loading: boolean;

  /**
   * the latest error raised by fetching the user or by an auth mutation.
   */
  error?: Error;

  /**
   * whether a user is currently authenticated.
   */
  isAuthenticated: boolean;

  /**
   * authenticates the visitor with a Google OAuth code.
   */
  loginWithGoogle: (code?: string) => Promise<void>;

  /**
   * authenticates the visitor with an email and password.
   */
  loginWithPassword: (email: string, password: string) => Promise<void>;

  /**
   * ends the current session and clears the cached user.
   */
  logout: () => Promise<void>;
};

/**
 * exposes the current authenticated user together with login and logout actions.
 * fetches the current user via GraphQL from the platform aspect and caches it,
 * so every component needing user data should rely on this hook instead of
 * hardcoding a default user.
 */
export function useAuth(options?: UseAuthOptions): UseAuthValue {
  const [sessionUser, setSessionUser] = useState<User | undefined>(undefined);
  const [signedOut, setSignedOut] = useState(false);
  const [actionError, setActionError] = useState<Error | undefined>(undefined);

  const currentUser = useCurrentUser({ mockData: options?.mockData });
  const googleLogin = useLoginWithGoogle();
  const passwordLogin = useLoginWithPassword();
  const logoutMutation = useLogout();

  const user = signedOut ? undefined : sessionUser || currentUser.user;

  const loginWithGoogle = async (code?: string) => {
    setActionError(undefined);
    try {
      const payload = await googleLogin.loginWithGoogle(code);
      setSessionUser(payload.user);
      setSignedOut(false);
    } catch (err) {
      setActionError(err instanceof Error ? err : new Error('Failed to login with Google'));
      throw err;
    }
  };

  const loginWithPassword = async (email: string, password: string) => {
    setActionError(undefined);
    try {
      const payload = await passwordLogin.loginWithPassword(email, password);
      setSessionUser(payload.user);
      setSignedOut(false);
    } catch (err) {
      setActionError(err instanceof Error ? err : new Error('Failed to login with password'));
      throw err;
    }
  };

  const logout = async () => {
    setActionError(undefined);
    await logoutMutation.logout();
    setSessionUser(undefined);
    setSignedOut(true);
  };

  const loading =
    currentUser.loading || googleLogin.loading || passwordLogin.loading || logoutMutation.loading;

  const error = actionError || currentUser.error;

  return {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    loginWithGoogle,
    loginWithPassword,
    logout,
  };
}
