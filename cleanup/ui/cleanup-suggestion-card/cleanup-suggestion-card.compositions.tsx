import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockCleanupSuggestion } from '@lov/cleanup.entities.cleanup-suggestion';
import { CleanupSuggestionCard } from './cleanup-suggestion-card.js';

export const NewslettersSuggestion = () => {
  const suggestion = mockCleanupSuggestion().toObject();

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '560px' }}>
        <CleanupSuggestionCard
          suggestion={suggestion}
          onExecute={(id) =>
            Promise.resolve({
              id,
              affected: suggestion.count,
              action: suggestion.action,
              minutesSaved: suggestion.estimatedMinutesSaved,
            })
          }
        />
      </div>
    </MockProvider>
  );
};

export const ProGatedSuggestion = () => {
  const suggestion = mockCleanupSuggestion({
    id: 'suggestion-old-promotions',
    rule: 'old-promotions',
    label: '87 promotional emails detected',
    description: 'Promotional emails that are more than 30 days old and unlikely to be needed.',
    count: 87,
    action: 'delete',
    estimatedMinutesSaved: 15,
    pro: true,
  }).toObject();

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '560px' }}>
        <CleanupSuggestionCard suggestion={suggestion} isPro={false} />
      </div>
    </MockProvider>
  );
};

export const ProUserUnlockedSuggestion = () => {
  const suggestion = mockCleanupSuggestion({
    id: 'suggestion-old-promotions',
    rule: 'old-promotions',
    label: '87 promotional emails detected',
    description: 'Promotional emails that are more than 30 days old and unlikely to be needed.',
    count: 87,
    action: 'delete',
    estimatedMinutesSaved: 15,
    pro: true,
  }).toObject();

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '560px' }}>
        <CleanupSuggestionCard
          suggestion={suggestion}
          isPro
          onExecute={(id) =>
            Promise.resolve({
              id,
              affected: suggestion.count,
              action: suggestion.action,
              minutesSaved: suggestion.estimatedMinutesSaved,
            })
          }
        />
      </div>
    </MockProvider>
  );
};
