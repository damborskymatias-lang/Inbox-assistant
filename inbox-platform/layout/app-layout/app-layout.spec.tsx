import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { AppLayout } from './app-layout.js';
import styles from './app-layout.module.scss';

it('should render children content', () => {
  const { getByText } = render(
    <MockProvider>
      <AppLayout mockUser={mockUser()}>
        <span>Page content</span>
      </AppLayout>
    </MockProvider>
  );

  expect(getByText('Page content')).toBeTruthy();
});

it('should render the sidebar for authenticated users', () => {
  const { container } = render(
    <MockProvider>
      <AppLayout mockUser={mockUser()}>
        <span>Page content</span>
      </AppLayout>
    </MockProvider>
  );

  const sidebar = container.querySelector('nav');
  expect(sidebar).toBeTruthy();
});

it('should not render the sidebar for anonymous users', async () => {
  const { container, findByText } = render(
    <MockProvider>
      <AppLayout>
        <span>Page content</span>
      </AppLayout>
    </MockProvider>
  );

  await findByText('Page content');

  const sidebar = container.querySelector('nav');
  expect(sidebar).toBeFalsy();
});

it('should render the layout root element', () => {
  const { container } = render(
    <MockProvider>
      <AppLayout mockUser={mockUser()}>
        <span>Page content</span>
      </AppLayout>
    </MockProvider>
  );

  const layout = container.querySelector(`.${styles.layout}`);
  expect(layout).toBeTruthy();
});
