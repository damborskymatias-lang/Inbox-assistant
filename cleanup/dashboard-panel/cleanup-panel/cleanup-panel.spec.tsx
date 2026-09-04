import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockCleanupSuggestion } from '@lov/cleanup.entities.cleanup-suggestion';
import { CleanupPanel } from './cleanup-panel.js';
import styles from './cleanup-panel.module.scss';

describe('CleanupPanel', () => {
  it('renders the highest-impact suggestion label', () => {
    const suggestions = [
      mockCleanupSuggestion({ id: `low-impact`, estimatedMinutesSaved: 5, label: `5 low impact emails` }),
      mockCleanupSuggestion({ id: `high-impact`, estimatedMinutesSaved: 40, label: `40 high impact emails` }),
    ];

    const { container } = render(
      <MockProvider>
        <CleanupPanel mockSuggestions={suggestions} />
      </MockProvider>
    );

    expect(container.textContent).toContain(`40 high impact emails`);
    expect(container.textContent).not.toContain(`5 low impact emails`);
  });

  it('renders a link to the cleanup route', () => {
    const suggestions = [mockCleanupSuggestion()];

    const { container } = render(
      <MockProvider>
        <CleanupPanel mockSuggestions={suggestions} cleanupHref="/cleanup" />
      </MockProvider>
    );

    const link = container.querySelector('a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toContain('/cleanup');
  });

  it('renders nothing when there are no suggestions', () => {
    const { container } = render(
      <MockProvider>
        <CleanupPanel mockSuggestions={[]} />
      </MockProvider>
    );

    expect(container.querySelector(`.${styles.panel}`)).toBeNull();
  });

  it('applies a custom class name to the panel root', () => {
    const suggestions = [mockCleanupSuggestion()];

    const { container } = render(
      <MockProvider>
        <CleanupPanel mockSuggestions={suggestions} className="custom-class" />
      </MockProvider>
    );

    const panel = container.querySelector(`.${styles.panel}`);
    expect(panel?.classList.contains('custom-class')).toBe(true);
  });
});
