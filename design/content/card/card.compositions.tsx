import React from 'react';
import { InboxTheme } from '@lov/design.inbox-theme';
import { Heading } from '@lov/design.typography.heading';
import { Card } from './card.js';

export const BasicCard = () => {
  return (
    <InboxTheme>
      <div style={{ padding: '1.5rem', maxWidth: '420px' }}>
        <Card title="Inbox summary">
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            You have 12 new emails today, 3 of them marked as urgent.
          </p>
        </Card>
      </div>
    </InboxTheme>
  );
};

export const CardWithActions = () => {
  return (
    <InboxTheme>
      <div style={{ padding: '1.5rem', maxWidth: '480px' }}>
        <Card
          title="Daily summary"
          actions={
            <button
              type="button"
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--colors-primary-default)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Refresh
            </button>
          }
        >
          <Heading level={3} size="sm">
            Good morning, Alex 👋
          </Heading>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'var(--colors-text-secondary)' }}>
            You have 8 new emails. Here is what actually matters today.
          </p>
        </Card>
      </div>
    </InboxTheme>
  );
};

export const ToneVariants = () => {
  return (
    <InboxTheme>
      <div
        style={{
          padding: '1.5rem',
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}
      >
        <Card title="Default" tone="default">
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Neutral surface for general content.</p>
        </Card>
        <Card title="Warning" tone="warning">
          <p style={{ margin: 0, fontSize: '0.85rem' }}>42 newsletters detected in the last 30 days.</p>
        </Card>
        <Card title="Success" tone="success">
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Archived — 42 emails cleared.</p>
        </Card>
        <Card title="Brand" tone="brand">
          <p style={{ margin: 0, fontSize: '0.85rem' }}>AI generated highlights for your day.</p>
        </Card>
      </div>
    </InboxTheme>
  );
};

export const InteractiveCard = () => {
  return (
    <InboxTheme>
      <div style={{ padding: '1.5rem', maxWidth: '260px' }}>
        <Card title="Urgent" interactive padding="sm">
          <div style={{ fontSize: '1.55rem', fontWeight: 700, lineHeight: 1 }}>4</div>
          <div style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: 'var(--colors-text-secondary)' }}>
            🔥 Needs your attention
          </div>
        </Card>
      </div>
    </InboxTheme>
  );
};
