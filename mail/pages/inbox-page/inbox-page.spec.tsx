import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { mockEmails } from '@lov/mail.entities.email';
import { InboxPage } from './inbox-page.js';
import styles from './inbox-page.module.scss';

const emails = mockEmails();
const counts = { urgent: 2, needsReply: 2, fyi: 4, promotions: 7, total: emails.length };

describe('InboxPage', () => {
  it('renders the inbox title', () => {
    const { container } = render(
      <MockProvider initialEntries={['/inbox']}>
        <InboxPage mockUser={mockUser()} mockEmailsData={emails} mockTriageCounts={counts} />
      </MockProvider>
    );

    const heading = container.querySelector('h1');
    expect(heading?.textContent).toContain('Inbox');
  });

  it('renders a sync button', () => {
    const { getByText } = render(
      <MockProvider initialEntries={['/inbox']}>
        <InboxPage mockUser={mockUser()} mockEmailsData={emails} mockTriageCounts={counts} />
      </MockProvider>
    );

    expect(getByText('Sync')).toBeTruthy();
  });

  it('renders the provided emails in the list', () => {
    const { getByText } = render(
      <MockProvider initialEntries={['/inbox']}>
        <InboxPage mockUser={mockUser()} mockEmailsData={emails} mockTriageCounts={counts} />
      </MockProvider>
    );

    expect(getByText(emails[0].subject)).toBeTruthy();
  });

  it('renders the selected email in the reader', () => {
    const { getAllByText } = render(
      <MockProvider initialEntries={['/inbox']}>
        <InboxPage
          mockUser={mockUser()}
          mockEmailsData={emails}
          mockTriageCounts={counts}
          mockSelectedEmail={emails[0]}
        />
      </MockProvider>
    );

    expect(getAllByText(emails[0].subject).length).toBeGreaterThan(0);
  });

  it('renders a registered email action in the reader toolbar', () => {
    function CustomAction() {
      return <button type="button">Custom Action</button>;
    }

    const { getByText } = render(
      <MockProvider initialEntries={['/inbox']}>
        <InboxPage
          mockUser={mockUser()}
          mockEmailsData={emails}
          mockTriageCounts={counts}
          mockSelectedEmail={emails[0]}
          emailActions={[{ name: 'custom-action', component: CustomAction }]}
        />
      </MockProvider>
    );

    expect(getByText('Custom Action')).toBeTruthy();
  });

  it('renders the search input', () => {
    const { container } = render(
      <MockProvider initialEntries={['/inbox']}>
        <InboxPage mockUser={mockUser()} mockEmailsData={emails} mockTriageCounts={counts} />
      </MockProvider>
    );

    const searchInput = container.querySelector('input[type="search"]');
    expect(searchInput).toBeTruthy();
  });

  it('applies the page class name to the root element', () => {
    const { container } = render(
      <MockProvider initialEntries={['/inbox']}>
        <InboxPage mockUser={mockUser()} mockEmailsData={emails} mockTriageCounts={counts} />
      </MockProvider>
    );

    const root = container.querySelector(`.${styles.page}`);
    expect(root).toBeTruthy();
  });
});
