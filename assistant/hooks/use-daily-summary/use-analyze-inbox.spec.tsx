import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { useAnalyzeInbox, ANALYZE_INBOX_MUTATION } from './use-analyze-inbox.js';

it('should trigger the analyze inbox mutation and return the analysis result', async () => {
  const mocks = [
    {
      request: { query: ANALYZE_INBOX_MUTATION },
      result: {
        data: {
          analyzeInbox: { analyzed: 12 },
        },
      },
    },
  ];

  const { result } = renderHook(() => useAnalyzeInbox(), {
    wrapper: ({ children }) => <MockProvider mocks={mocks}>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);

  await act(async () => {
    await result.current.analyzeInbox();
  });

  await waitFor(() => {
    expect(result.current.analysis?.analyzed).toBe(12);
  });
});

it('should start with no analysis result and not loading', () => {
  const { result } = renderHook(() => useAnalyzeInbox(), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.analysis).toBeUndefined();
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});
