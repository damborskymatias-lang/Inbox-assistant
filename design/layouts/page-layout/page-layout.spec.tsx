import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PageLayout } from './page-layout.js';
import styles from './page-layout.module.scss';

it('renders the title and subtitle', () => {
  const { container } = render(
    <MemoryRouter>
      <PageLayout title="Inbox settings" subtitle="Manage your preferences" />
    </MemoryRouter>
  );

  const header = container.querySelector(`.${styles.header}`);
  expect(header?.textContent).toContain('Inbox settings');
  expect(header?.textContent).toContain('Manage your preferences');
});

it('renders the children within the content area', () => {
  const { container } = render(
    <MemoryRouter>
      <PageLayout title="Inbox settings">
        <span>Page body content</span>
      </PageLayout>
    </MemoryRouter>
  );

  const content = container.querySelector(`.${styles.content}`);
  expect(content?.textContent).toContain('Page body content');
});

it('renders the actions when provided', () => {
  const { container } = render(
    <MemoryRouter>
      <PageLayout title="Inbox settings" actions={<button type="button">Archive all</button>} />
    </MemoryRouter>
  );

  const actions = container.querySelector(`.${styles.actions}`);
  expect(actions?.textContent).toContain('Archive all');
});

it('does not render a header row when no title, subtitle or actions are provided', () => {
  const { container } = render(
    <MemoryRouter>
      <PageLayout>
        <span>Just content</span>
      </PageLayout>
    </MemoryRouter>
  );

  const header = container.querySelector(`.${styles.header}`);
  expect(header).toBeNull();
});

it('applies a custom class name to the root container', () => {
  const { container } = render(
    <MemoryRouter>
      <PageLayout className="custom-page">
        <span>Content</span>
      </PageLayout>
    </MemoryRouter>
  );

  const root = container.querySelector('.custom-page');
  expect(root).toBeTruthy();
});
