import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { Login } from './login.js';
import styles from './login.module.scss';

it('should render the headline and permissions note', () => {
  const { container } = render(
    <MockProvider>
      <Login mockUser={mockUser()} />
    </MockProvider>
  );

  const headline = container.querySelector(`.${styles.headline}`);
  const permissions = container.querySelector(`.${styles.permissions}`);

  expect(headline?.textContent).toBe(`Process your inbox in minutes`);
  expect(permissions?.textContent).toBe(
    `Read-only access to triage, plus permission to send replies you approve.`
  );
});

it('should reveal the demo sign-in form when the toggle is clicked', () => {
  const { container } = render(
    <MockProvider>
      <Login mockUser={mockUser()} />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.demoForm}`)).toBeFalsy();

  const toggle = container.querySelector(`.${styles.demoToggle}`) as HTMLButtonElement;
  fireEvent.click(toggle);

  expect(container.querySelector(`.${styles.demoForm}`)).toBeTruthy();
});

it('should prefill the demo form with the provided credentials', () => {
  const { container } = render(
    <MockProvider>
      <Login mockUser={mockUser()} demoEmail="priya@demo.inbox" demoPassword="priya-pass" />
    </MockProvider>
  );

  const toggle = container.querySelector(`.${styles.demoToggle}`) as HTMLButtonElement;
  fireEvent.click(toggle);

  const inputs = container.querySelectorAll(`.${styles.demoForm} input`);
  const emailInput = inputs[0] as HTMLInputElement;
  const passwordInput = inputs[1] as HTMLInputElement;

  expect(emailInput.value).toBe(`priya@demo.inbox`);
  expect(passwordInput.value).toBe(`priya-pass`);
});

it('should show an inline error when the Google sign-in fails', async () => {
  const { container } = render(
    <MockProvider>
      <Login mockUser={mockUser()} />
    </MockProvider>
  );

  const googleButton = container.querySelector(`button[type="button"]`) as HTMLButtonElement;
  fireEvent.click(googleButton);

  await waitFor(() => {
    expect(container.querySelector(`.${styles.error}`)).toBeTruthy();
  });
});
