import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { FeaturesSection } from './features-section.js';
import { defaultFeatures } from './features-section.mock.js';

import type { FeatureItem } from './feature-item-type.js';

export const BasicFeaturesSection = () => {
  return (
    <MockProvider>
      <FeaturesSection />
    </MockProvider>
  );
};

export const CustomFeaturesSection = () => {
  const customFeatures: FeatureItem[] = [
    {
      icon: `🔍`,
      title: `Semantic search`,
      description: `Find any email in seconds by describing what you remember, not just keywords.`,
      highlight: `Search by meaning`,
    },
    {
      icon: `🔔`,
      title: `Smart notifications`,
      description: `Only get pinged for emails the AI scores as truly urgent.`,
      highlight: `Fewer, better alerts`,
    },
    {
      icon: `📊`,
      title: `Weekly insights`,
      description: `See trends in response time, volume and time saved every week.`,
      highlight: `Track your progress`,
    },
  ];

  return (
    <MockProvider>
      <FeaturesSection
        eyebrow="New this quarter"
        title="Built for a calmer week"
        subtitle="A few of the newest additions to the AI inbox assistant."
        features={customFeatures}
      />
    </MockProvider>
  );
};

export const FeaturesSectionOnDarkPage = () => {
  return (
    <MockProvider>
      <div style={{ background: 'var(--colors-surface-secondary)', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <FeaturesSection features={defaultFeatures.slice(0, 3)} />
      </div>
    </MockProvider>
  );
};
