import type { MockedResponse } from '@apollo/client/testing';
import { mockCleanupSuggestions } from '@lov/cleanup.entities.cleanup-suggestion';
import { LIST_SUGGESTIONS_QUERY } from './use-cleanup-suggestions.js';
import { EXECUTE_SUGGESTION_MUTATION } from './use-execute-suggestion.js';

/**
 * Apollo mocked response resolving the list of cleanup suggestions,
 * matching the prototype's newsletters and old-promotions suggestions.
 */
export function mockListSuggestionsResponse(): MockedResponse {
  return {
    request: { query: LIST_SUGGESTIONS_QUERY },
    result: {
      data: {
        listSuggestions: mockCleanupSuggestions().map((suggestion) => suggestion.toObject()),
      },
    },
  };
}

/**
 * Apollo mocked response resolving the execution of the newsletters
 * cleanup suggestion.
 */
export function mockExecuteSuggestionResponse(id = 'suggestion-newsletters'): MockedResponse {
  return {
    request: { query: EXECUTE_SUGGESTION_MUTATION, variables: { id } },
    result: {
      data: {
        executeSuggestion: {
          id,
          affected: 42,
          action: 'archive',
          minutesSaved: 24,
        },
      },
    },
  };
}
