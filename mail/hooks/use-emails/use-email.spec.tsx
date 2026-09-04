import React from 'react';
import { renderHook } from '@testing-library/react';
import { mockEmail } from '@lov/mail.entities.email';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { useEmail } from './use-email.js';

it('should return the mock email without loading when mockData is provided', () => {
  const email = mockEmail({ id: 'e1', subject: 'Project update', body: 'Full body text' });

  const { result } = renderHook(() => useEmail('e1', { mockData: email }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.email?.subject).toBe('Project update');
  expect(result.current.email?.body).toBe('Full body text');
});

it('should be in a loading state when no mock data is provided', () => {
  const { result } = renderHook(() => useEmail('e1'), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(true);
  expect(result.current.email).toBeUndefined();
});
