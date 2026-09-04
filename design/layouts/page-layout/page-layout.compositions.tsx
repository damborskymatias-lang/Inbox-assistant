import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { PageLayout } from './page-layout.js';

export const BasicPageLayout = () => {
  return (
    <MockProvider>
      <PageLayout title="Inbox settings" subtitle="Manage how the assistant triages and replies to your email.">
        <div
          style={{
            border: '1px solid var(--borders-default-color)',
            borderRadius: 'var(--borders-radius-large)',
            background: 'var(--colors-surface-primary)',
            padding: '1.1rem',
          }}
        >
          <p style={{ margin: 0, fontFamily: 'var(--typography-font-family)', color: 'var(--colors-text-default)' }}>
            General preferences, notification rules and triage sensitivity live here.
          </p>
        </div>
      </PageLayout>
    </MockProvider>
  );
};

export const PageLayoutWithActions = () => {
  return (
    <MockProvider>
      <PageLayout
        title="Daily summary"
        subtitle="You have 3 urgent emails and 12 that need a reply."
        actions={
          <React.Fragment>
            <button
              type="button"
              style={{
                border: '1px solid var(--borders-default-color)',
                background: 'var(--colors-surface-primary)',
                color: 'var(--colors-text-primary)',
                borderRadius: 'var(--borders-radius-medium)',
                padding: '0.5rem 0.85rem',
                fontSize: 'var(--typography-sizes-body-small)',
                fontWeight: 'var(--typography-font-weight-semi-bold)',
                cursor: 'var(--interactions-cursor-pointer)',
              }}
            >
              Export
            </button>
            <button
              type="button"
              style={{
                border: 'none',
                background: 'var(--colors-primary-default)',
                color: 'var(--colors-text-inverse)',
                borderRadius: 'var(--borders-radius-medium)',
                padding: '0.5rem 0.85rem',
                fontSize: 'var(--typography-sizes-body-small)',
                fontWeight: 'var(--typography-font-weight-semi-bold)',
                cursor: 'var(--interactions-cursor-pointer)',
              }}
            >
              Archive all
            </button>
          </React.Fragment>
        }
      >
        <div
          style={{
            border: '1px solid var(--borders-default-color)',
            borderRadius: 'var(--borders-radius-large)',
            background: 'var(--colors-surface-primary)',
            padding: '1.1rem',
          }}
        >
          <p style={{ margin: 0, fontFamily: 'var(--typography-font-family)', color: 'var(--colors-text-default)' }}>
            🧹 42 newsletters detected from the last 30 days.
          </p>
        </div>
      </PageLayout>
    </MockProvider>
  );
};

export const NarrowPageLayout = () => {
  return (
    <MockProvider>
      <PageLayout title="Account" subtitle="Personal details and security" maxWidth="640px">
        <div
          style={{
            border: '1px solid var(--borders-default-color)',
            borderRadius: 'var(--borders-radius-large)',
            background: 'var(--colors-surface-primary)',
            padding: '1.1rem',
            display: 'grid',
            gap: '0.5rem',
          }}
        >
          <p style={{ margin: 0, fontFamily: 'var(--typography-font-family)', color: 'var(--colors-text-primary)' }}>
            Peter Novak
          </p>
          <p style={{ margin: 0, fontFamily: 'var(--typography-font-family)', color: 'var(--colors-text-secondary)' }}>
            peter@inboxassistant.ai
          </p>
        </div>
      </PageLayout>
    </MockProvider>
  );
};
