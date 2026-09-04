import { renderHook } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { useDigestHistory } from './use-digest-history.js';
import { mockDigestHistory } from './use-daily-digest.mock.js';

it('should return the mock digest history immediately without loading', () => {
  const mockData = mockDigestHistory();

  const { result } = renderHook(() => useDigestHistory(7, { mockData }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
  expect(result.current.digests).toHaveLength(mockData.length);
});

it('should preserve the order of the provided mock digests', () => {
  const mockData = mockDigestHistory();

  const { result } = renderHook(() => useDigestHistory(7, { mockData }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.digests[0].date).toBe(mockData[0].date);
  expect(result.current.digests[mockData.length - 1].date).toBe(mockData[mockData.length - 1].date);
});

it('should return an empty list when no mock data is provided and query is pending', () => {
  const { result } = renderHook(() => useDigestHistory(7), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(true);
  expect(result.current.digests).toEqual([]);
});
