import React from 'react';
import { gql } from '@apollo/client';
import type { MockedResponse } from '@apollo/client/testing';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockEmail } from '@lov/mail.entities.email';
import { ReplyComposer } from './reply-composer.js';

const GENERATE_REPLY_MUTATION = gql`
  mutation GenerateReply($options: GenerateReplyOptions) {
    generateReply(options: $options) {
      id
      emailId
      body
      tone
      generatedAt
    }
  }
`;

const johnEmail = mockEmail({
  id: 'e1',
  sender: 'John Carter',
  senderEmail: 'john@northwind.io',
  subject: 'Project update for Q3 rollout?',
  body: `Hi Peter,\n\nCould you share where we stand on the Q3 rollout? The steering committee meets Thursday and I would like to bring numbers.\n\nThanks,\nJohn`,
  category: 'work',
  importance: 9,
  needsReply: true,
}).toObject();

const lenaEmail = mockEmail({
  id: 'e4',
  sender: 'Lena Fischer',
  senderEmail: 'lena@designstudio.de',
  subject: 'Contract review — one open point',
  body: `Hi Peter,\n\nLegal is fine with everything except clause 7.2 on liability. Can you confirm the cap we agreed on?\n\nBest,\nLena`,
  category: 'work',
  importance: 8,
  needsReply: true,
}).toObject();

const successMocks: MockedResponse[] = [
  {
    request: {
      query: GENERATE_REPLY_MUTATION,
      variables: { options: { emailId: 'e1', instructions: undefined } },
    },
    result: {
      data: {
        generateReply: {
          id: 'reply-e1',
          emailId: 'e1',
          body: `Hi John,\n\nThanks for reaching out — I'll send you the project update tomorrow morning.\n\nBest,\nPeter`,
          tone: 'friendly',
          generatedAt: '2024-05-20T08:20:00.000Z',
        },
      },
    },
  },
  {
    request: {
      query: GENERATE_REPLY_MUTATION,
      variables: { options: { emailId: 'e1', instructions: 'Write the reply in a formal tone.' } },
    },
    result: {
      data: {
        generateReply: {
          id: 'reply-e1-formal',
          emailId: 'e1',
          body: `Dear John,\n\nThank you for your message. I will provide the project update ahead of Thursday's steering call.\n\nRegards,\nPeter`,
          tone: 'formal',
          generatedAt: '2024-05-20T08:22:00.000Z',
        },
      },
    },
  },
];

const regenerateMocks: MockedResponse[] = [
  {
    request: {
      query: GENERATE_REPLY_MUTATION,
      variables: { options: { emailId: 'e4', instructions: undefined } },
    },
    result: {
      data: {
        generateReply: {
          id: 'reply-e4',
          emailId: 'e4',
          body: `Hi Lena,\n\nWe agreed on a liability cap of 1.5x annual fees. Please confirm clause 7.2 reflects that.\n\nBest,\nPeter`,
          tone: 'friendly',
          generatedAt: '2024-05-20T09:00:00.000Z',
        },
      },
    },
  },
];

const quotaErrorMocks: MockedResponse[] = [
  {
    request: {
      query: GENERATE_REPLY_MUTATION,
      variables: { options: { emailId: 'e1', instructions: undefined } },
    },
    result: {
      errors: [
        {
          message: 'Quota exceeded',
          extensions: { code: 'QUOTA_EXCEEDED' },
        } as any,
      ],
    },
  },
];

export const BasicReplyComposer = () => {
  return (
    <MockProvider mocks={successMocks}>
      <div style={{ padding: '1.5rem', maxWidth: '520px' }}>
        <ReplyComposer email={johnEmail} />
      </div>
    </MockProvider>
  );
};

export const RegenerateReplyComposer = () => {
  return (
    <MockProvider mocks={regenerateMocks}>
      <div style={{ padding: '1.5rem', maxWidth: '520px' }}>
        <ReplyComposer email={lenaEmail} />
      </div>
    </MockProvider>
  );
};

export const QuotaExceededReplyComposer = () => {
  return (
    <MockProvider mocks={quotaErrorMocks}>
      <div style={{ padding: '1.5rem', maxWidth: '520px' }}>
        <ReplyComposer email={johnEmail} />
      </div>
    </MockProvider>
  );
};
