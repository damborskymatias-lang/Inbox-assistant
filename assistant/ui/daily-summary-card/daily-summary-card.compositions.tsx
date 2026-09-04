import React, { useState } from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockDailySummary } from '@lov/assistant.entities.daily-summary';
import { DailySummaryCard } from './daily-summary-card.js';

export const BasicDailySummaryCard = () => {
  const summary = mockDailySummary().toObject();

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '480px' }}>
        <DailySummaryCard summary={summary} name="Peter" />
      </div>
    </MockProvider>
  );
};

export const LoadingDailySummaryCard = () => {
  const summary = mockDailySummary().toObject();

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '480px' }}>
        <DailySummaryCard summary={summary} name="Peter" loading />
      </div>
    </MockProvider>
  );
};

export const InteractiveRegenerate = () => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const summary = mockDailySummary({ totalNew: 38 + count }).toObject();

  const handleRegenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setCount((prev) => prev + 1);
      setLoading(false);
    }, 1200);
  };

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '480px' }}>
        <DailySummaryCard
          summary={summary}
          name="Alex"
          loading={loading}
          onRegenerate={() => handleRegenerate()}
        />
      </div>
    </MockProvider>
  );
};
