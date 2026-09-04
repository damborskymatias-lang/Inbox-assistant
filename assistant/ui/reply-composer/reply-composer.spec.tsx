import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import type { MockedResponse } from '@apollo/client/testing';
import { mockEmail } from '@lov/mail.entities.email';
import { ReplyComposer } from './reply-composer.js';
import styles from './reply-composer.module.scss';

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
  body: `Hi Peter,\n\nCould you share where we stand on the Q3 rollout?`,
  category: 'work',
  importance: 9,
  needsReply: true,
}).toObject();

function renderWithMocks(mocks: MockedResponse[], email = johnEmail, onSent?: (email: typeof johnEmail, minutes: number) => void) {
  return render(
    <MemoryRouter>
      <MockedProvider mocks={mocks} showWarnings={false}>
        <ReplyComposer email={email} onSent={onSent} />
      </MockedProvider>
    </MemoryRouter>
  );
}

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
        body: `Hi John,\n\nThanks for reaching out.\n\nBest,\nPeter`,
        tone: 'friendly',
        generatedAt: '2024-05-20T08:20:00.000Z',
      },
    },
  },
};

const quotaErrorMock: MockedResponse = {
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
};

it('should render the Generate Reply button initially', () => {
  const { container } = renderWithMocks([successMock]);
  const button = container.querySelector('button');
  expect(button?.textContent).toContain('Generate Reply');
});

it('should show the drafting indicator while generating', async () => {
  const { container, getByText } = renderWithMocks([successMock]);
  const button = container.querySelector('button') as HTMLButtonElement;

  fireEvent.click(button);

  expect(getByText('Drafting a reply in your writing style…')).toBeTruthy();

  await waitFor(() => {
    const textarea = container.querySelector('textarea');
    expect(textarea).toBeTruthy();
  });
});

it('should render an editable textarea prefilled with the draft after generating', async () => {
  const { container } = renderWithMocks([successMock]);
  const button = container.querySelector('button') as HTMLButtonElement;

  fireEvent.click(button);

  await waitFor(() => {
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea?.value).toContain('Thanks for reaching out');
  });
});

it('should show a success confirmation when the reply is sent', async () => {
  const { container, getByText } = renderWithMocks([successMock]);
  const button = container.querySelector('button') as HTMLButtonElement;

  fireEvent.click(button);

  await waitFor(() => {
    expect(container.querySelector('textarea')).toBeTruthy();
  });

  const sendButton = Array.from(container.querySelectorAll('button')).find((btnElement) =>
    btnElement.textContent?.includes('Send reply')
  ) as HTMLButtonElement;

  fireEvent.click(sendButton);

  await waitFor(() => {
    expect(getByText(/Reply sent to John/)).toBeTruthy();
  });
});

it('should call onSent with the email when the reply is sent', async () => {
  let sentEmail: typeof johnEmail | undefined;
  const handleSent = (email: typeof johnEmail) => {
    sentEmail = email;
  };

  const { container } = renderWithMocks([successMock], johnEmail, handleSent);
  const button = container.querySelector('button') as HTMLButtonElement;

  fireEvent.click(button);

  await waitFor(() => {
    expect(container.querySelector('textarea')).toBeTruthy();
  });

  const sendButton = Array.from(container.querySelectorAll('button')).find((btnElement) =>
    btnElement.textContent?.includes('Send reply')
  ) as HTMLButtonElement;

  fireEvent.click(sendButton);

  await waitFor(() => {
    expect(sentEmail?.id).toBe('e1');
  });
});

it('should discard the draft and show the generate button again', async () => {
  const { container } = renderWithMocks([successMock]);
  const button = container.querySelector('button') as HTMLButtonElement;

  fireEvent.click(button);

  await waitFor(() => {
    expect(container.querySelector('textarea')).toBeTruthy();
  });

  const discardButton = Array.from(container.querySelectorAll('button')).find((btnElement) =>
    btnElement.textContent?.includes('Discard')
  ) as HTMLButtonElement;

  fireEvent.click(discardButton);

  await waitFor(() => {
    expect(container.querySelector('textarea')).toBeFalsy();
  });
});

it('should render an upgrade prompt when the quota is exhausted', async () => {
  const { container, getByText } = renderWithMocks([quotaErrorMock]);
  const button = container.querySelector('button') as HTMLButtonElement;

  fireEvent.click(button);

  await waitFor(() => {
    expect(container.querySelector(`.${styles.upgradePrompt}`)).toBeTruthy();
  });

  expect(getByText(/reached your AI reply limit/)).toBeTruthy();
});
