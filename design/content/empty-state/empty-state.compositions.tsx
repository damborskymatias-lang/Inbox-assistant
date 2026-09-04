import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { EmptyState } from './empty-state.js';

export const InboxZero = () => {
  return (
    <MockProvider>
      <div style={{ maxWidth: '480px', padding: '1.5rem' }}>
        <EmptyState
          icon="🎉"
          title="Inbox zero!"
          description="You've handled everything for today. Enjoy the quiet."
        />
      </div>
    </MockProvider>
  );
};

export const NoCleanupSuggestions = () => {
  return (
    <MockProvider>
      <div style={{ maxWidth: '480px', padding: '1.5rem' }}>
        <EmptyState
          icon="🧹"
          title="Nothing to clean up"
          description="We didn't find any newsletters or promotions to archive right now."
        />
      </div>
    </MockProvider>
  );
};

export const NoEmailSelectedWithAction = () => {
  return (
    <MockProvider>
      <div style={{ maxWidth: '480px', padding: '1.5rem' }}>
        <EmptyState
          icon="✉️"
          title="No email selected"
          description="Pick an email from the list to read it and generate a reply."
          actionLabel="Open first email"
          onAction={() => alert('Opening the first email in the list')}
        />
      </div>
    </MockProvider>
  );
};
