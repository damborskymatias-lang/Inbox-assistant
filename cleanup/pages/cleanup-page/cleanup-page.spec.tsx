import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { mockCleanupSuggestion, mockCleanupSuggestions } from '@lov/cleanup.entities.cleanup-suggestion';
import { CleanupPage } from './cleanup-page.js';
import styles from './cleanup-page.module.scss';

describe('CleanupPage', () => {
  it('renders a cleanup card for each detected suggestion', () => {
    const { container } = render(
      <MockProvider initialEntries={['/cleanup']}>
        <CleanupPage mockUser={mockUser()} mockSuggestions={mockCleanupSuggestions()} />
      </MockProvider>
    );

    const cards = container.querySelectorAll(`.${styles.cardsList} > *`);
    expect(cards.length).toBe(2);
  });

  it('summarizes the total emails and estimated minutes saved', () => {
    const suggestions = [
      mockCleanupSuggestion({ count: 42, estimatedMinutesSaved: 24 }),
      mockCleanupSuggestion({ id: 'suggestion-2', count: 8, estimatedMinutesSaved: 6 }),
    ];

    const { container } = render(
      <MockProvider initialEntries={['/cleanup']}>
        <CleanupPage mockUser={mockUser()} mockSuggestions={suggestions} />
      </MockProvider>
    );

    const stats = container.querySelectorAll(`.${styles.statValue}`);
    expect(stats[0].textContent).toBe('50');
    expect(stats[1].textContent).toBe('~30m');
  });

  it('shows the celebratory empty state when there are no suggestions', () => {
    const { getByText, container } = render(
      <MockProvider initialEntries={['/cleanup']}>
        <CleanupPage mockUser={mockUser()} mockSuggestions={[]} />
      </MockProvider>
    );

    expect(getByText('Your inbox is already clean 🎉')).toBeTruthy();
    expect(container.querySelector(`.${styles.cardsList}`)).toBeNull();
  });

  it('does not render header stats when there are no suggestions', () => {
    const { container } = render(
      <MockProvider initialEntries={['/cleanup']}>
        <CleanupPage mockUser={mockUser()} mockSuggestions={[]} />
      </MockProvider>
    );

    const stats = container.querySelector(`.${styles.stats}`);
    expect(stats).toBeNull();
  });
});
