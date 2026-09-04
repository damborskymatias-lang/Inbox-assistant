import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockDailySummary } from '@lov/assistant.entities.daily-summary';
import { useDailySummary, GET_DAILY_SUMMARY } from './use-daily-summary.js';

it('should return the provided mock summary without loading', () => {
  const mockSummary = mockDailySummary().toObject();

  const { result } = renderHook(() => useDailySummary({ mockData: mockSummary }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.summary?.greeting).toBe(mockSummary.greeting);
  expect(result.current.summary?.totalNew).toBe(mockSummary.totalNew);
});

it('should return no summary when data has not resolved yet', () => {
  const { result } = renderHook(() => useDailySummary(), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.summary).toBeUndefined();
});

it('should fetch the daily summary from the graphql query', async () => {
  const mockSummary = mockDailySummary().toObject();

  const mocks = [
    {
      request: { query: GET_DAILY_SUMMARY },
      result: {
        data: {
          getDailySummary: {
            id: mockSummary.id,
            date: mockSummary.date,
            totalNew: mockSummary.totalNew,
            greeting: mockSummary.greeting,
            highlights: mockSummary.highlights,
            suggestedActions: mockSummary.suggestedActions,
          },
        },
      },
    },
  ];

  const { result } = renderHook(() => useDailySummary(), {
    wrapper: ({ children }) => <MockProvider mocks={mocks}>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.summary?.greeting).toBe(mockSummary.greeting);
  });

  expect(result.current.loading).toBe(false);
});
