import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import type { MockedResponse } from '@apollo/client/testing';
import { gql } from '@apollo/client';
import { useArchiveEmails } from './use-archive-emails.js';

const ARCHIVE_EMAILS_MUTATION = gql`
  mutation ArchiveEmails($options: ArchiveEmailsOptions) {
    archiveEmails(options: $options) {
      affected
    }
  }
`;

it('should archive emails and return the affected count', async () => {
  const mocks: MockedResponse[] = [
    {
      request: {
        query: ARCHIVE_EMAILS_MUTATION,
        variables: { options: { ids: ['e1', 'e2'] } },
      },
      result: {
        data: { archiveEmails: { __typename: 'EmailActionResult', affected: 2 } },
      },
    },
  ];

  const { result } = renderHook(() => useArchiveEmails(), {
    wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
  });

  const response = await result.current.archiveEmails(['e1', 'e2']);

  await waitFor(() => {
    expect(response?.affected).toBe(2);
  });
});
