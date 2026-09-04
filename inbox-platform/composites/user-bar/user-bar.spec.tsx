import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { UserBar } from './user-bar.js';
import type { UserBarMenuItem } from './user-bar-menu-item-type.js';
import styles from './user-bar.module.scss';

const menuItems: UserBarMenuItem[] = [
  { label: `Profile settings`, href: `/settings/profile`, weight: 1 },
];

it('renders the user name for an authenticated user', () => {
  const { container } = render(
    <MockProvider>
      <UserBar mockUser={mockUser()} />
    </MockProvider>
  );

  const name = container.querySelector(`.${styles.name}`);
  expect(name?.textContent).toBe(`Peter Novak`);
});

it('opens the dropdown and shows registered menu items', () => {
  const { container } = render(
    <MockProvider>
      <UserBar mockUser={mockUser()} menuItems={menuItems} />
    </MockProvider>
  );

  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLElement;
  fireEvent.click(trigger);

  const menuLink = container.querySelector(`.${styles.menuLink}`);
  expect(menuLink?.textContent).toBe(`Profile settings`);
});

it('shows the sign out action inside the dropdown', () => {
  const { container } = render(
    <MockProvider>
      <UserBar mockUser={mockUser()} />
    </MockProvider>
  );

  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLElement;
  fireEvent.click(trigger);

  const signOutButton = container.querySelector(`.${styles.signOutButton}`);
  expect(signOutButton?.textContent).toContain(`Sign out`);
});

it('renders a Continue with Google button for anonymous visitors', async () => {
  const { container } = render(
    <MockProvider>
      <UserBar />
    </MockProvider>
  );

  await waitFor(() => {
    const trigger = container.querySelector(`.${styles.trigger}`);
    expect(trigger).toBeFalsy();
  });

  const button = container.querySelector('button');
  expect(button?.textContent).toContain(`Continue with Google`);
});
