import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CleanupSuggestionCard } from './cleanup-suggestion-card.js';

const baseSuggestion = {
  id: 'suggestion-newsletters',
  rule: 'newsletters',
  label: '42 newsletters detected',
  description: 'Newsletters and promotions from the last 30 days.',
  count: 42,
  action: 'archive' as const,
  estimatedMinutesSaved: 24,
  pro: false,
};

it('renders the suggestion label', () => {
  const { getByText } = render(
    <MemoryRouter>
      <CleanupSuggestionCard suggestion={baseSuggestion} />
    </MemoryRouter>
  );

  expect(getByText('🧹 42 newsletters detected from the last 30 days')).toBeTruthy();
});

it('opens the confirm dialog with the exact count and action when the button is clicked', () => {
  const { getByText } = render(
    <MemoryRouter>
      <CleanupSuggestionCard suggestion={baseSuggestion} />
    </MemoryRouter>
  );

  fireEvent.click(getByText('Archive all'));

  expect(getByText('Archive 42 emails?')).toBeTruthy();
});

it('flips to a success state showing emails cleared and minutes saved once confirmed', async () => {
  const onExecute = () =>
    Promise.resolve({ id: baseSuggestion.id, affected: 42, action: 'archive' as const, minutesSaved: 24 });

  const { getByText, findByText } = render(
    <MemoryRouter>
      <CleanupSuggestionCard suggestion={baseSuggestion} onExecute={onExecute} />
    </MemoryRouter>
  );

  const archiveButtons = document.querySelectorAll('button');
  const initialArchiveButton = Array.from(archiveButtons).find((button) => button.textContent === 'Archive all');

  expect(initialArchiveButton).toBeTruthy();

  fireEvent.click(initialArchiveButton as HTMLButtonElement);

  const dialogButtons = document.querySelectorAll('[role="dialog"] button');
  const confirmButton = Array.from(dialogButtons).find((button) => button.textContent === 'Archive all');

  expect(confirmButton).toBeTruthy();

  fireEvent.click(confirmButton as HTMLButtonElement);

  const successText = await findByText('Archived — 42 emails cleared');
  expect(successText).toBeTruthy();

  const minutesText = await findByText('~24 minutes saved');
  expect(minutesText).toBeTruthy();
});

it('shows a lock and upgrade prompt instead of the action button for pro-gated suggestions', () => {
  const proSuggestion = { ...baseSuggestion, pro: true };

  const { getByText, queryByText } = render(
    <MemoryRouter>
      <CleanupSuggestionCard suggestion={proSuggestion} isPro={false} />
    </MemoryRouter>
  );

  expect(getByText('Upgrade to Pro to unlock this cleanup')).toBeTruthy();
  expect(queryByText('Archive all')).toBeNull();
});

it('shows the action button for pro-gated suggestions when the user is pro', () => {
  const proSuggestion = { ...baseSuggestion, pro: true };

  const { getByText, queryByText } = render(
    <MemoryRouter>
      <CleanupSuggestionCard suggestion={proSuggestion} isPro />
    </MemoryRouter>
  );

  expect(getByText('Archive all')).toBeTruthy();
  expect(queryByText('Upgrade to Pro to unlock this cleanup')).toBeNull();
});
