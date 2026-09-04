import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { Spinner, DraftingIndicator } from './spinner.js';

export const SpinnerSizes = () => {
  return (
    <MockProvider>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
        <Spinner size="xs" />
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </div>
    </MockProvider>
  );
};

export const SpinnerWithLabel = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem' }}>
        <Spinner size="md" label="Loading your inbox…" />
      </div>
    </MockProvider>
  );
};

export const DraftingReplyIndicator = () => {
  return (
    <MockProvider>
      <div
        style={{
          padding: '1.5rem',
          maxWidth: '420px',
          border: '1px solid var(--borders-default-color)',
          borderRadius: 'var(--borders-radius-large)',
          background: 'var(--colors-surface-primary)',
        }}
      >
        <DraftingIndicator />
      </div>
    </MockProvider>
  );
};

export const CustomDraftingLabel = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem' }}>
        <DraftingIndicator label="Summarizing your daily digest…" />
      </div>
    </MockProvider>
  );
};
