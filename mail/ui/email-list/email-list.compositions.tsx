import React, { useState } from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockEmails } from '@lov/mail.entities.email';
import { EmailList } from './email-list.js';

const emails = mockEmails().map((email) => email.toObject());

export const BasicEmailList = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>(emails[0]?.id);

  return (
    <MockProvider>
      <div style={{ maxWidth: `640px`, padding: `1.5rem` }}>
        <EmailList
          emails={emails.slice(0, 6)}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
          onArchive={(id) => alert(`Archive ${id}`)}
          onDelete={(id) => alert(`Delete ${id}`)}
        />
      </div>
    </MockProvider>
  );
};

export const LoadingEmailList = () => {
  return (
    <MockProvider>
      <div style={{ maxWidth: `640px`, padding: `1.5rem` }}>
        <EmailList emails={[]} loading />
      </div>
    </MockProvider>
  );
};

export const EmptyEmailList = () => {
  return (
    <MockProvider>
      <div style={{ maxWidth: `640px`, padding: `1.5rem` }}>
        <EmailList emails={[]} />
      </div>
    </MockProvider>
  );
};
