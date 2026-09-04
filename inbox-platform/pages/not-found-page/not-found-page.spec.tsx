import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { NotFoundPage } from './not-found-page.js';
import styles from './not-found-page.module.scss';

describe('NotFoundPage', () => {
  it('renders the 404 code and message', () => {
    const { container } = render(
      <MockProvider initialEntries={['/unknown']}>
        <NotFoundPage />
      </MockProvider>
    );

    const code = container.querySelector(`.${styles.code}`);
    expect(code?.textContent).toBe(`404`);
  });

  it('renders a button back to the dashboard', () => {
    const { container } = render(
      <MockProvider initialEntries={['/unknown']}>
        <NotFoundPage />
      </MockProvider>
    );

    const action = container.querySelector(`.${styles.action}`);
    expect(action?.textContent).toContain('Back to dashboard');
  });

  it('renders the empty state description', () => {
    const { container } = render(
      <MockProvider initialEntries={['/unknown']}>
        <NotFoundPage />
      </MockProvider>
    );

    const emptyState = container.querySelector(`.${styles.emptyState}`);
    expect(emptyState?.textContent).toContain(`doesn't exist`);
  });
});
