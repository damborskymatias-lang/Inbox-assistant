import React from 'react';
import { InboxTheme } from '@lov/design.inbox-theme';
import { Heading } from './heading.js';

export const DashboardHeadings = () => {
  return (
    <InboxTheme>
      <div style={{ padding: '2rem', display: 'grid', gap: '1rem' }}>
        <Heading level={1}>Good morning, Alex 👋</Heading>
        <Heading level={2}>You have 3 urgent emails</Heading>
        <Heading level={3}>📥 Inbox summary</Heading>
      </div>
    </InboxTheme>
  );
};

export const SizeOverrides = () => {
  return (
    <InboxTheme>
      <div style={{ padding: '2rem', display: 'grid', gap: '1rem' }}>
        <Heading level={2} size="xl">
          Large visual weight, semantic h2
        </Heading>
        <Heading level={1} size="sm">
          Small visual weight, semantic h1
        </Heading>
        <Heading level={4} size="md" weight="medium">
          Custom weight heading
        </Heading>
      </div>
    </InboxTheme>
  );
};

export const AllLevels = () => {
  return (
    <InboxTheme>
      <div style={{ padding: '2rem', display: 'grid', gap: '0.75rem' }}>
        <Heading level={1}>Heading level 1</Heading>
        <Heading level={2}>Heading level 2</Heading>
        <Heading level={3}>Heading level 3</Heading>
        <Heading level={4}>Heading level 4</Heading>
        <Heading level={5}>Heading level 5</Heading>
        <Heading level={6}>Heading level 6</Heading>
      </div>
    </InboxTheme>
  );
};
