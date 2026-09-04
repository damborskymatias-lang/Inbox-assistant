import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { ProgressBar } from './progress-bar.js';

export const AiReplyQuota = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '360px', display: 'grid', gap: '1rem' }}>
        <ProgressBar label="AI replies used" value={18} max={30} showValue />
        <ProgressBar label="AI replies used" value={24} max={30} showValue />
        <ProgressBar label="AI replies used" value={29} max={30} showValue />
      </div>
    </MockProvider>
  );
};

export const DigestGoals = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '360px', display: 'grid', gap: '1rem' }}>
        <ProgressBar label="Inbox zero streak" value={5} max={7} tone="success" showValue />
        <ProgressBar label="Newsletters archived" value={42} max={50} tone="brand" showValue />
      </div>
    </MockProvider>
  );
};

export const ToneEscalation = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '360px', display: 'grid', gap: '1rem' }}>
        <ProgressBar label="Low usage" value={5} max={30} showValue />
        <ProgressBar label="Approaching limit" value={23} max={30} showValue />
        <ProgressBar label="Almost exhausted" value={28} max={30} showValue />
        <ProgressBar label="Forced success tone" value={28} max={30} tone="success" showValue />
      </div>
    </MockProvider>
  );
};
