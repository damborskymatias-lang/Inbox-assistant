import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import type { MockedResponse } from '@apollo/client/testing';
import { gql } from '@apollo/client';
import { EMAIL_DETAIL_FIELDS } from './email-fragments.js';
import { useSendReply } from './use-send-reply.js';

const SEND_REPLY_MUTATION = gql`
  mutation SendReply($options: SendReplyOptions!) {
    sendReply(options: $options) {
      ...EmailDetailFields
    }
  }
  ${EMAIL_DETAIL_FIELDS}
`;

it('should send a reply and return the updated email', async () => {
  const mocks: MockedResponse[] = [
    {
      request: {
        query: SEND_REPLY_MUTATION,
        variables: { options: { emailId: 'e1', body: 'Sounds good!' } },
      },
      result: {
        data: {
          sendReply: {
            __typename: 'Email',
            id: 'e1',
            gmailId: 'gmail-e1',
            threadId: 'thread-e1',
            sender: 'John Carter',
            senderEmail: 'john@northwind.io',
            subject: 'Project update',
            body: 'Sounds good!',
            snippet: 'Sounds good!',
            summary: null,
            category: 'work',
            importance: 9,
            needsReply: false,
            replyGenerated: true,
            bucket: 'fyi',
            receivedAt: '2024-05-20T08:12:00.000Z',
            read: true,
            archived: false,
          },
        },
      },
    },
  ];

  const { result } = renderHook(() => useSendReply(), {
    wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
  });

  const response = await result.current.sendReply('e1', 'Sounds good!');

  await waitFor(() => {
    expect(response?.body).toBe('Sounds good!');
    expect(response?.replyGenerated).toBe(true);
  });
});
