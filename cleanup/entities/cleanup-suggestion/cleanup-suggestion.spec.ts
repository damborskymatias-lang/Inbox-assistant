import { CleanupSuggestion } from './cleanup-suggestion.js';
import { mockCleanupSuggestion, mockCleanupSuggestions } from './cleanup-suggestion.mock.js';

it('has a CleanupSuggestion.from() method', () => {
  expect(CleanupSuggestion.from).toBeTruthy();
});

it('creates a CleanupSuggestion instance from a plain object', () => {
  const suggestion = CleanupSuggestion.from({
    id: 's1',
    rule: 'newsletters',
    label: '42 newsletters detected',
    description: 'Newsletters and promotions from the last 30 days.',
    count: 42,
    action: 'archive',
    estimatedMinutesSaved: 24,
    pro: false,
  });

  expect(suggestion).toBeInstanceOf(CleanupSuggestion);
  expect(suggestion.id).toEqual('s1');
  expect(suggestion.label).toEqual('42 newsletters detected');
  expect(suggestion.action).toEqual('archive');
});

it('serializes a CleanupSuggestion into a plain object with toObject()', () => {
  const suggestion = mockCleanupSuggestion();
  const plain = suggestion.toObject();

  expect(plain).toEqual({
    id: suggestion.id,
    rule: suggestion.rule,
    label: suggestion.label,
    description: suggestion.description,
    count: suggestion.count,
    action: suggestion.action,
    estimatedMinutesSaved: suggestion.estimatedMinutesSaved,
    pro: suggestion.pro,
  });
});

it('returns an id property that matches the entity id', () => {
  const suggestion = mockCleanupSuggestion({ id: 'custom-id' });
  expect(suggestion.toObject().id).toEqual('custom-id');
});

it('supports partial overrides in mockCleanupSuggestion()', () => {
  const suggestion = mockCleanupSuggestion({ count: 5, action: 'delete' });
  expect(suggestion.count).toEqual(5);
  expect(suggestion.action).toEqual('delete');
  expect(suggestion.label).toEqual('42 newsletters detected');
});

it('mockCleanupSuggestions() returns suggestions matching the prototype', () => {
  const suggestions = mockCleanupSuggestions();

  expect(suggestions).toHaveLength(2);
  expect(suggestions[0].label).toEqual('42 newsletters detected');
  expect(suggestions[0].action).toEqual('archive');
  expect(suggestions[1].label).toEqual('Delete promotional emails older than 30 days');
  expect(suggestions[1].action).toEqual('delete');
});
