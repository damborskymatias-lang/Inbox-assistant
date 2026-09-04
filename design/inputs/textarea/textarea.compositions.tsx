import React, { useState } from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { Textarea } from './textarea.js';

const DRAFT_REPLY = `Hi Sarah,

Thanks for reaching out — I'll send you the project update tomorrow morning.

Best,
Peter`;

export const BasicTextarea = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '480px' }}>
        <Textarea label="Reply" placeholder="Write your reply..." />
      </div>
    </MockProvider>
  );
};

export const AutoGrowReplyDraft = () => {
  const [draft, setDraft] = useState(DRAFT_REPLY);

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '480px' }}>
        <Textarea
          label="AI generated reply"
          value={draft}
          onChange={(nextValue) => setDraft(nextValue)}
          autoGrow
          minRows={4}
          maxRows={12}
          showCount
          helperText="Edit the draft before sending."
        />
      </div>
    </MockProvider>
  );
};

export const TextareaWithError = () => {
  const [draft, setDraft] = useState('Hey');

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '480px' }}>
        <Textarea
          label="Reply"
          value={draft}
          onChange={(nextValue) => setDraft(nextValue)}
          error="Your reply is too short — add a bit more context."
          minRows={3}
          maxLength={280}
          showCount
        />
      </div>
    </MockProvider>
  );
};

export const DisabledTextarea = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '480px' }}>
        <Textarea
          label="Reply"
          defaultValue="Reply sent — this field is now locked."
          disabled
          minRows={3}
        />
      </div>
    </MockProvider>
  );
};
