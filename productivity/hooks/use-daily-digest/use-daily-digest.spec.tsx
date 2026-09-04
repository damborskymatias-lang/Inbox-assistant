import { renderHook } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { useDailyDigest } from './use-daily-digest.js';
import { mockTodayDigest } from './use-daily-digest.mock.js';

it('should return the mock digest immediately without loading', () => {
  const mockData = mockTodayDigest();

  const { result } = renderHook(() => useDailyDigest({ mockData }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
  expect(result.current.digest?.emailsProcessed).toBe(mockData.emailsProcessed);
});

it('should expose minutes saved from the provided mock digest', () => {
  const mockData = mockTodayDigest();

  const { result } = renderHook(() => useDailyDigest({ mockData }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.digest?.minutesSaved).toBe(mockData.minutesSaved);
});

it('should be in a loading state when no mock data is provided', () => {
  const { result } = renderHook(() => useDailyDigest(), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(true);
  expect(result.current.digest).toBeUndefined();
});
