import React from 'react';
import { renderHook } from '@testing-library/react';
import { mockEmail } from '@lov/mail.entities.email';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { useEmails } from './use-emails.js';

it('should return mock emails without loading when mockData is provided', () => {
  const emails = [mockEmail({ id: 'a', subject: 'Hello' }), mockEmail({ id: 'b', subject: 'World' })];

  const { result } = renderHook(() => useEmails({ mockData: emails }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.emails).toHaveLength(2);
  expect(result.current.emails[0].subject).toBe('Hello');
});

it('should be in a loading state when no mock data is provided', () => {
  const { result } = renderHook(() => useEmails(), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(true);
  expect(result.current.emails).toHaveLength(0);
});
