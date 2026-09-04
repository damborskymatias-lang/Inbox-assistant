import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockCleanupSuggestion, mockCleanupSuggestions } from '@lov/cleanup.entities.cleanup-suggestion';
import { useCleanupSuggestions } from './use-cleanup-suggestions.js';
import { usePreviewSuggestion, PREVIEW_SUGGESTION_QUERY } from './use-preview-suggestion.js';
import { useExecuteSuggestion } from './use-execute-suggestion.js';
import { mockExecuteSuggestionResponse } from './use-cleanup-suggestions.mock.js';

it('should return the mocked suggestions without a network request', () => {
  const suggestions = mockCleanupSuggestions();
  const { result } = renderHook(() => useCleanupSuggestions({ mockData: suggestions }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.suggestions).toHaveLength(2);
  expect(result.current.suggestions[0].label).toBe('42 newsletters detected');
});

it('should resolve to an empty list when no mock data and no server is available', async () => {
  const { result } = renderHook(() => useCleanupSuggestions(), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.suggestions).toEqual([]);
  expect(result.current.error).toBeDefined();
});

it('should preview a suggestion using the provided graphql mocks', async () => {
  const previewMock = {
    request: { query: PREVIEW_SUGGESTION_QUERY, variables: { id: 'suggestion-newsletters' } },
    result: {
      data: {
        previewSuggestion: { emailIds: ['e1', 'e2'], count: 2 },
      },
    },
  };

  const { result } = renderHook(() => usePreviewSuggestion(), {
    wrapper: ({ children }) => <MockProvider mocks={[previewMock]}>{children}</MockProvider>,
  });

  let preview;
  await act(async () => {
    preview = await result.current.previewSuggestion('suggestion-newsletters');
  });

  expect(preview).toEqual({ emailIds: ['e1', 'e2'], count: 2 });
});

it('should execute a suggestion and expose the result', async () => {
  const suggestion = mockCleanupSuggestion();
  const executeMock = mockExecuteSuggestionResponse(suggestion.id);

  const { result } = renderHook(() => useExecuteSuggestion(), {
    wrapper: ({ children }) => <MockProvider mocks={[executeMock]}>{children}</MockProvider>,
  });

  let executed;
  await act(async () => {
    executed = await result.current.executeSuggestion(suggestion.id);
  });

  expect(executed).toEqual({
    id: suggestion.id,
    affected: 42,
    action: 'archive',
    minutesSaved: 24,
  });
});
