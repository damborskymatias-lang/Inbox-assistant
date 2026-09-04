import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { Header } from './header.js';
import type { HeaderAction } from './header-action-type.js';
import styles from './header.module.scss';

function SavedMinutesAction() {
  return <span className="saved-minutes-action">You saved ~24 minutes today</span>;
}

const headerActions: HeaderAction[] = [
  { name: `minutes-saved`, component: SavedMinutesAction, weight: 1 },
];

it('renders the logo', () => {
  const { container } = render(
    <MockProvider>
      <Header mockUser={mockUser()} />
    </MockProvider>
  );

  const logoLink = container.querySelector('a');
  expect(logoLink).toBeTruthy();
});

it('renders registered header actions sorted by weight', () => {
  const actions: HeaderAction[] = [
    { name: `second`, component: () => <span className="second-action">Second</span>, weight: 2 },
    { name: `first`, component: () => <span className="first-action">First</span>, weight: 1 },
  ];

  const { container } = render(
    <MockProvider>
      <Header headerActions={actions} mockUser={mockUser()} />
    </MockProvider>
  );

  const actionsContainer = container.querySelector(`.${styles.actions}`);
  const rendered = actionsContainer?.children;
  expect(rendered?.[0].className).toBe(`first-action`);
  expect(rendered?.[1].className).toBe(`second-action`);
});

it('does not render an actions container when there are no header actions', () => {
  const { container } = render(
    <MockProvider>
      <Header mockUser={mockUser()} />
    </MockProvider>
  );

  const actionsContainer = container.querySelector(`.${styles.actions}`);
  expect(actionsContainer).toBeFalsy();
});

it('calls onToggleSidebar when the hamburger button is clicked', () => {
  const onToggleSidebar = () => {
    calls += 1;
  };
  let calls = 0;

  const { container } = render(
    <MockProvider>
      <Header headerActions={headerActions} mockUser={mockUser()} onToggleSidebar={onToggleSidebar} />
    </MockProvider>
  );

  const menuButton = container.querySelector(`.${styles.menuButton}`) as HTMLElement;
  fireEvent.click(menuButton);

  expect(calls).toBe(1);
});
