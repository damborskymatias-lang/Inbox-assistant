import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import type { MockedResponse } from '@apollo/client/testing';
import { gql } from '@apollo/client';
import { useSyncEmails } from './use-sync-emails.js';

const SYNC_EMAILS_MUTATION = gql`
  mutation SyncEmails {
    syncEmails {
      synced
    }
  }
`;

it('should sync emails and return the synced count', async () => {
  const mocks: MockedResponse[] = [
    {
      request: {
        query: SYNC_EMAILS_MUTATION,
      },
      result: {
        data: { syncEmails: { __typename: 'SyncEmailsResult', synced: 4 } },
      },
    },
  ];

  const { result } = renderHook(() => useSyncEmails(), {
    wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
  });

  const response = await result.current.syncEmails();

  await waitFor(() => {
    expect(response?.synced).toBe(4);
  });
});
