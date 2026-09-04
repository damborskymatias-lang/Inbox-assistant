import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { mockEmails } from '@lov/mail.entities.email';
import { Button } from '@lov/design.actions.button';
import { InboxPage } from './inbox-page.js';

const emails = mockEmails();
const counts = { urgent: 2, needsReply: 2, fyi: 4, promotions: 7, total: emails.length };

export const BasicInboxPage = () => {
  return (
    <MockProvider initialEntries={['/inbox']}>
      <InboxPage
        mockUser={mockUser()}
        mockEmailsData={emails}
        mockTriageCounts={counts}
        mockSelectedEmail={emails[0]}
      />
    </MockProvider>
  );
};

export const InboxPageWithRegisteredAction = () => {
  function GenerateReplyAction() {
    return (
      <Button variant="primary" size="sm">
        ✨ Generate Reply
      </Button>
    );
  }

  return (
    <MockProvider initialEntries={['/inbox']}>
      <InboxPage
        mockUser={mockUser()}
        mockEmailsData={emails}
        mockTriageCounts={counts}
        mockSelectedEmail={emails[0]}
        emailActions={[{ name: 'generate-reply', weight: 1, component: GenerateReplyAction }]}
      />
    </MockProvider>
  );
};

export const InboxPageEmptyFilter = () => {
  return (
    <MockProvider initialEntries={['/inbox']}>
      <InboxPage
        mockUser={mockUser()}
        mockEmailsData={[]}
        mockTriageCounts={{ urgent: 0, needsReply: 0, fyi: 0, promotions: 0, total: 0 }}
      />
    </MockProvider>
  );
};
