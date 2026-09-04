import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockEmail } from '@lov/mail.entities.email';
import { GenerateReplyAction } from './generate-reply-action.js';
import styles from './generate-reply-action.module.scss';

const johnEmail = mockEmail({
  id: `e1`,
  sender: `John Carter`,
  senderEmail: `john@northwind.io`,
  subject: `Project update for Q3 rollout?`,
  body: `Hi Peter,\n\nCould you share where we stand on the Q3 rollout?`,
  category: `work`,
  importance: 9,
  needsReply: true,
}).toObject();

it('should render the Generate Reply entry point button', () => {
  const { container } = render(
    <MockProvider>
      <GenerateReplyAction email={johnEmail} />
    </MockProvider>
  );

  const button = container.querySelector('button');
  expect(button?.textContent).toContain('Generate Reply');
});

it('should render the collapsed action container initially', () => {
  const { container } = render(
    <MockProvider>
      <GenerateReplyAction email={johnEmail} />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.action}`)).toBeTruthy();
  expect(container.querySelector(`.${styles.expanded}`)).toBeFalsy();
});

it('should expand the reply composer inline when clicked', () => {
  const { container } = render(
    <MockProvider>
      <GenerateReplyAction email={johnEmail} />
    </MockProvider>
  );

  const button = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(button);

  expect(container.querySelector(`.${styles.expanded}`)).toBeTruthy();
});

it('should apply a custom className to the container', () => {
  const { container } = render(
    <MockProvider>
      <GenerateReplyAction email={johnEmail} className="custom-class" />
    </MockProvider>
  );

  expect(container.querySelector('.custom-class')).toBeTruthy();
});
