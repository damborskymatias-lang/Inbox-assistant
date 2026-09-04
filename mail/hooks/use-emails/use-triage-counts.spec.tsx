import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { useTriageCounts } from './use-triage-counts.js';

it('should return the mock counts without loading when mockData is provided', () => {
  const counts = { urgent: 3, needsReply: 5, fyi: 8, promotions: 12, total: 28 };

  const { result } = renderHook(() => useTriageCounts({ mockData: counts }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.counts).toEqual(counts);
});

it('should be in a loading state when no mock data is provided', () => {
  const { result } = renderHook(() => useTriageCounts(), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(true);
  expect(result.current.counts).toBeUndefined();
});
