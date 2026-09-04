import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { useDigestPreferences } from './use-digest-preferences.js';
import { mockDigestPreferences } from './use-daily-digest.mock.js';

it('should return the mock preferences immediately without loading', () => {
  const mockData = mockDigestPreferences();

  const { result } = renderHook(() => useDigestPreferences({ mockData }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.preferences?.enabled).toBe(mockData.enabled);
  expect(result.current.preferences?.channel).toBe(mockData.channel);
  expect(result.current.preferences?.timeOfDay).toBe(mockData.timeOfDay);
});

it('should update the mock preferences via updatePreferences', async () => {
  const mockData = mockDigestPreferences();

  const { result } = renderHook(() => useDigestPreferences({ mockData }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  let updated;
  await act(async () => {
    updated = await result.current.updatePreferences({ enabled: false });
  });

  expect(updated?.enabled).toBe(false);
  expect(result.current.updating).toBe(false);
});

it('should be in a loading state when no mock data is provided', () => {
  const { result } = renderHook(() => useDigestPreferences(), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(true);
  expect(result.current.preferences).toBeUndefined();
});
