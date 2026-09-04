import type { CleanupAction, CleanupResult } from '@lov/cleanup.entities.cleanup-suggestion';

export type { CleanupAction, CleanupResult };

/**
 * the emails a cleanup suggestion would affect, resolved before the
 * user confirms the bulk action.
 */
export type CleanupPreview = {
  /**
   * identifiers of the emails the suggestion would archive or delete.
   */
  emailIds: string[];

  /**
   * amount of emails the suggestion would affect.
   */
  count: number;
};

/**
 * options for previewing a single cleanup suggestion.
 */
export type PreviewSuggestionOptions = {
  /**
   * id of the suggestion to preview.
   */
  id: string;
};

/**
 * options for executing a single cleanup suggestion.
 */
export type ExecuteSuggestionOptions = {
  /**
   * id of the suggestion to execute.
   */
  id: string;
};

/**
 * a cleanup rule contributed over the network, matching emails by the
 * keywords of its name.
 */
export type CleanupRuleOptions = {
  /**
   * unique id of the rule. defaults to its name.
   */
  id?: string;

  /**
   * name of the rule, whose words are used as the matched keywords.
   */
  name: string;

  /**
   * explanation of what applying the rule does.
   */
  description?: string;

  /**
   * action applied to every matched email.
   */
  action?: string;
};

/**
 * options for registering cleanup rules over the network.
 */
export type RegisterCleanupRuleOptions = {
  /**
   * the cleanup rules to register.
   */
  rules?: CleanupRuleOptions[];
};
