import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import type { MockedResponse } from '@apollo/client/testing';
import { gql } from '@apollo/client';
import { useDeleteEmails } from './use-delete-emails.js';

const DELETE_EMAILS_MUTATION = gql`
  mutation DeleteEmails($options: DeleteEmailsOptions) {
    deleteEmails(options: $options) {
      affected
    }
  }
`;

it('should delete emails and return the affected count', async () => {
  const mocks: MockedResponse[] = [
    {
      request: {
        query: DELETE_EMAILS_MUTATION,
        variables: { options: { ids: ['e1'] } },
      },
      result: {
        data: { deleteEmails: { __typename: 'EmailActionResult', affected: 1 } },
      },
    },
  ];

  const { result } = renderHook(() => useDeleteEmails(), {
    wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
  });

  const response = await result.current.deleteEmails(['e1']);

  await waitFor(() => {
    expect(response?.affected).toBe(1);
  });
});
