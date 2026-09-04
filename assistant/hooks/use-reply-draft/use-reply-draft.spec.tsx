import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import type { MockedResponse } from '@apollo/client/testing';
import { GENERATE_REPLY_MUTATION, useReplyDraft } from './use-reply-draft.js';

const successMock: MockedResponse = {
  request: {
    query: GENERATE_REPLY_MUTATION,
    variables: { options: { emailId: 'e1', instructions: undefined } },
  },
  result: {
    data: {
      generateReply: {
        id: 'reply-e1',
        emailId: 'e1',
        body: 'Hi John,\n\nThanks for reaching out.\n\nBest,\nPeter',
        tone: 'friendly',
        generatedAt: '2024-01-15T08:20:00.000Z',
      },
    },
  },
};

const quotaErrorMock: MockedResponse = {
  request: {
    query: GENERATE_REPLY_MUTATION,
    variables: { options: { emailId: 'e2', instructions: undefined } },
  },
  result: {
    errors: [
      {
        message: 'Quota exceeded',
        extensions: { code: 'QUOTA_EXCEEDED' },
      } as any,
    ],
  },
};

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

it('should generate a reply draft for an email', async () => {
  const { result } = renderHook(() => useReplyDraft(), {
    wrapper: wrapper([successMock]),
  });

  await act(async () => {
    await result.current.generate('e1');
  });

  await waitFor(() => {
    expect(result.current.draft?.body).toContain('Thanks for reaching out');
  });

  expect(result.current.draft?.emailId).toBe('e1');
  expect(result.current.error).toBeUndefined();
});

it('should surface a quota-exceeded error distinctly', async () => {
  const { result } = renderHook(() => useReplyDraft(), {
    wrapper: wrapper([quotaErrorMock]),
  });

  await act(async () => {
    await result.current.generate('e2');
  });

  await waitFor(() => {
    expect(result.current.error?.quotaExceeded).toBe(true);
  });

  expect(result.current.draft).toBeUndefined();
});

it('should discard the current draft and clear the error', async () => {
  const { result } = renderHook(() => useReplyDraft(), {
    wrapper: wrapper([successMock]),
  });

  await act(async () => {
    await result.current.generate('e1');
  });

  await waitFor(() => {
    expect(result.current.draft).toBeDefined();
  });

  act(() => {
    result.current.discard();
  });

  expect(result.current.draft).toBeUndefined();
  expect(result.current.error).toBeUndefined();
});
