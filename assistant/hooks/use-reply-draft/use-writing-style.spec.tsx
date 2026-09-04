import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import type { MockedResponse } from '@apollo/client/testing';
import {
  GET_WRITING_STYLE_QUERY,
  UPDATE_WRITING_STYLE_MUTATION,
  useWritingStyle,
} from './use-writing-style.js';

function wrapper(mocks: MockedResponse[]) {
  return function Wrapper({ children }: { children?: React.ReactNode }) {
    return (
      <MemoryRouter>
        <MockedProvider mocks={mocks} showWarnings={false}>
          {children}
        </MockedProvider>
      </MemoryRouter>
    );
  };
}

it('should return the default writing style when mock data is not provided and query is loading', () => {
  const { result } = renderHook(() => useWritingStyle(), {
    wrapper: wrapper([]),
  });

  expect(result.current.writingStyle.tone).toBe('friendly');
  expect(result.current.writingStyle.length).toBe('medium');
});

it('should return mock writing style data without querying the network', () => {
  const { result } = renderHook(
    () =>
      useWritingStyle({
        mockData: { tone: 'formal', length: 'long', signOff: 'Regards,\nPeter' },
      }),
    { wrapper: wrapper([]) }
  );

  expect(result.current.writingStyle.tone).toBe('formal');
  expect(result.current.writingStyle.length).toBe('long');
  expect(result.current.writingStyle.signOff).toBe('Regards,\nPeter');
  expect(result.current.loading).toBe(false);
});

it('should load the writing style from the query', async () => {
  const queryMock: MockedResponse = {
    request: { query: GET_WRITING_STYLE_QUERY },
    result: {
      data: {
        getWritingStyle: { tone: 'concise', length: 'short', signOff: 'Best,\nPeter' },
      },
    },
  };

  const { result } = renderHook(() => useWritingStyle(), {
    wrapper: wrapper([queryMock]),
  });

  await waitFor(() => {
    expect(result.current.writingStyle.tone).toBe('concise');
  });

  expect(result.current.writingStyle.length).toBe('short');
});

it('should update the writing style', async () => {
  const queryMock: MockedResponse = {
    request: { query: GET_WRITING_STYLE_QUERY },
    result: {
      data: {
        getWritingStyle: { tone: 'friendly', length: 'medium', signOff: 'Best,\nPeter' },
      },
    },
  };

  const updateMock: MockedResponse = {
    request: {
      query: UPDATE_WRITING_STYLE_MUTATION,
      variables: { options: { tone: 'formal' } },
    },
    result: {
      data: {
        updateWritingStyle: { tone: 'formal', length: 'medium', signOff: 'Best,\nPeter' },
      },
    },
  };

  const { result } = renderHook(() => useWritingStyle(), {
    wrapper: wrapper([queryMock, updateMock]),
  });

  await waitFor(() => {
    expect(result.current.writingStyle.tone).toBe('friendly');
  });

  await act(async () => {
    await result.current.updateWritingStyle({ tone: 'formal' });
  });

  await waitFor(() => {
    expect(result.current.writingStyle.tone).toBe('formal');
  });
});
