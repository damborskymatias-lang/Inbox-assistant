import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { Paragraph } from './paragraph.js';

export const BasicParagraph = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '420px' }}>
        <Paragraph size="md" tone="default">
          Thanks for reaching out — I&apos;ll send you the project update tomorrow morning.
        </Paragraph>
      </div>
    </MockProvider>
  );
};

export const ParagraphSizesAndTones = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', display: 'grid', gap: '0.75rem', maxWidth: '420px' }}>
        <Paragraph size="lg" weight="semiBold" tone="default">
          You have 3 urgent emails
        </Paragraph>
        <Paragraph size="md" tone="soft">
          Your quarterly report is due by end of day. Please review the attached figures.
        </Paragraph>
        <Paragraph size="sm" tone="muted">
          Received 9:12 AM · importance 8/10
        </Paragraph>
        <Paragraph size="sm" tone="success" weight="medium">
          Reply sent — ~4 minutes saved.
        </Paragraph>
        <Paragraph size="sm" tone="danger" weight="medium">
          Payment verification required within 24 hours.
        </Paragraph>
      </div>
    </MockProvider>
  );
};

export const TruncatedSummary = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '280px' }}>
        <Paragraph size="sm" tone="soft" truncate={2}>
          The design review meeting has been rescheduled to Thursday at 3pm. Please review the
          attached mockups before the call and share any comments in the shared doc so we can move
          faster once we get together.
        </Paragraph>
      </div>
    </MockProvider>
  );
};
