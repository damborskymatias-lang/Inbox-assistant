import type { SlotRegistry } from '@bitdev/harmony.harmony';
import type { Email } from '@lov/mail.entities.email';

/**
 * a cleanup rule contributed by the cleanup aspect or by any other aspect,
 * detecting a group of emails which can safely be archived or deleted in bulk.
 */
export type CleanupRule = {
  /**
   * unique name of the rule, used as the rule id of the suggestions it produces.
   */
  name: string;

  /**
   * noun phrase describing the matched emails, composed with the matched count
   * into the suggestion headline, e.g. "newsletters detected from the last 30 days".
   */
  label: string;

  /**
   * action applied to every matched email.
   */
  action: 'archive' | 'delete';

  /**
   * longer explanation of what applying the rule does, shown on the suggestion card.
   */
  description?: string;

  /**
   * whether the rule is part of the pro plan.
   */
  pro?: boolean;

  /**
   * ordering weight, lower values are detected first.
   */
  weight?: number;

  /**
   * selects the emails matched by the rule out of the active mailbox.
   */
  match: (emails: Email[]) => Email[];
};

export type CleanupRuleSlot = SlotRegistry<CleanupRule[]>;
