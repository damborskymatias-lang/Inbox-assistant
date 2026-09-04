import React, { useState } from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import type { TriageBucket } from '@lov/mail.entities.email';
import { TriageTiles } from './triage-tiles.js';

export const BasicTriageTiles = () => {
  const [active, setActive] = useState<TriageBucket | 'all'>(`all`);

  return (
    <MockProvider>
      <div style={{ padding: `1.5rem`, maxWidth: `760px` }}>
        <TriageTiles
          counts={{ urgent: 5, needsReply: 12, fyi: 18, promotions: 31 }}
          active={active}
          onSelect={(bucket) => setActive(bucket)}
        />
      </div>
    </MockProvider>
  );
};

export const UrgentSelected = () => {
  return (
    <MockProvider>
      <div style={{ padding: `1.5rem`, maxWidth: `760px` }}>
        <TriageTiles counts={{ urgent: 3, needsReply: 8, fyi: 14, promotions: 42 }} active="urgent" />
      </div>
    </MockProvider>
  );
};

export const LoadingTriageTiles = () => {
  return (
    <MockProvider>
      <div style={{ padding: `1.5rem`, maxWidth: `760px` }}>
        <TriageTiles loading />
      </div>
    </MockProvider>
  );
};
