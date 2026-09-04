import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { useAuth } from './use-auth.js';

it('should return the authenticated user when mock data is provided', () => {
  const user = mockUser();
  const { result } = renderHook(() => useAuth({ mockData: user }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.user?.email).toBe(user.email);
  expect(result.current.isAuthenticated).toBe(true);
});

it('should not be authenticated when no user is provided', async () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.user).toBeUndefined();
  expect(result.current.isAuthenticated).toBe(false);
});

it('should clear the session user on logout', async () => {
  const user = mockUser();
  const { result } = renderHook(() => useAuth({ mockData: user }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.isAuthenticated).toBe(true);

  await result.current.logout();

  await waitFor(() => {
    expect(result.current.isAuthenticated).toBe(false);
  });
});
