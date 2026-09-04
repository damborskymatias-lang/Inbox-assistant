import React, { useState } from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { Icon } from '@lov/design.content.icon';
import { TextInput } from './text-input.js';

function SearchIcon() {
  return (
    <Icon size="sm" color="muted">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </Icon>
  );
}

export const BasicTextInput = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '360px' }}>
        <TextInput label="Full name" placeholder="Jane Cooper" helperText="As it appears on your email account" />
      </div>
    </MockProvider>
  );
};

export const SearchFilterField = () => {
  const [value, setValue] = useState(`urgent invoices`);
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '360px' }}>
        <TextInput
          type="search"
          placeholder="Search your inbox"
          iconStart={<SearchIcon />}
          clearable
          value={value}
          onChange={(nextValue) => setValue(nextValue)}
        />
      </div>
    </MockProvider>
  );
};

export const SettingsFormWithError = () => {
  const [email, setEmail] = useState(`not-an-email`);
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', display: 'grid', gap: '1.25rem', maxWidth: '360px' }}>
        <TextInput
          label="Forwarding address"
          type="email"
          value={email}
          onChange={(nextValue) => setEmail(nextValue)}
          error={email.includes(`@`) ? undefined : `Enter a valid email address`}
        />
        <TextInput
          label="Daily summary time"
          defaultValue="08:00 AM"
          helperText="We'll send your inbox digest at this time every day"
          disabled
        />
      </div>
    </MockProvider>
  );
};
