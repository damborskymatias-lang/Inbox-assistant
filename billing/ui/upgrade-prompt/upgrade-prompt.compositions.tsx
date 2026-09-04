import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { UpgradePrompt } from './upgrade-prompt.js';

export const InlineUpgradePrompt = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '520px' }}>
        <UpgradePrompt feature="unlimitedAiReplies" variant="inline" />
      </div>
    </MockProvider>
  );
};

export const CardUpgradePrompt = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem' }}>
        <UpgradePrompt feature="smartInboxCleanup" variant="card" onDismiss={() => {}} />
      </div>
    </MockProvider>
  );
};

export const BannerUpgradePrompt = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem' }}>
        <UpgradePrompt feature="priorityProcessing" variant="banner" onDismiss={() => {}} />
      </div>
    </MockProvider>
  );
};

export const GatedFeatureVariants = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem', maxWidth: '520px' }}>
        <UpgradePrompt feature="personalizedWritingStyle" variant="inline" />
        <UpgradePrompt feature="advancedFilters" variant="inline" />
      </div>
    </MockProvider>
  );
};
