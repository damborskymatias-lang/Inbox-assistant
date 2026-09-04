import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockEmail } from '@lov/mail.entities.email';
import { EmailReader } from './email-reader.js';
import styles from './email-reader.module.scss';

const email = mockEmail({
  id: `e1`,
  sender: `John Carter`,
  senderEmail: `john@northwind.io`,
  subject: `Project update for Q3 rollout?`,
  body: `Line one\n\nLine two`,
  importance: 9,
  receivedAt: new Date().toISOString(),
}).toObject();

it(`should render the empty state when no email is provided`, () => {
  const { container } = render(
    <MockProvider>
      <EmailReader />
    </MockProvider>
  );

  const emptyRoot = container.querySelector(`.${styles.empty}`);
  expect(emptyRoot).toBeTruthy();
});

it(`should render the email subject and sender address`, () => {
  const { container } = render(
    <MockProvider>
      <EmailReader email={email} />
    </MockProvider>
  );

  expect(container.textContent).toContain(`Project update for Q3 rollout?`);
  expect(container.textContent).toContain(`john@northwind.io`);
});

it(`should render registered actions in the toolbar slot`, () => {
  const { container } = render(
    <MemoryRouter>
      <EmailReader email={email} actions={[<span key="a">Generate Reply</span>]} />
    </MemoryRouter>
  );

  const slot = container.querySelector(`.${styles.actionsSlot}`);
  expect(slot).toBeTruthy();
  expect(slot?.textContent).toContain(`Generate Reply`);
});

it(`should call onArchive when the archive button is clicked`, () => {
  let archived = false;
  const { container } = render(
    <MemoryRouter>
      <EmailReader email={email} onArchive={() => { archived = true; }} />
    </MemoryRouter>
  );

  const buttons = container.querySelectorAll(`button`);
  fireEvent.click(buttons[0]);

  expect(archived).toBe(true);
});

it(`should call onDelete when the delete button is clicked`, () => {
  let deleted = false;
  const { container } = render(
    <MemoryRouter>
      <EmailReader email={email} onDelete={() => { deleted = true; }} />
    </MemoryRouter>
  );

  const buttons = container.querySelectorAll(`button`);
  fireEvent.click(buttons[1]);

  expect(deleted).toBe(true);
});
