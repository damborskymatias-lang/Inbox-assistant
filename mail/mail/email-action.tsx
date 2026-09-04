import type { ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';
import type { Email } from '@lov/mail.entities.email';

/**
 * an email action registered by a feature aspect (for example "Generate Reply"),
 * rendered into the email reader toolbar for the currently open email.
 */
export type EmailAction = {
  /**
   * unique name of the action, used as the React key.
   */
  name: string;

  /**
   * ordering weight, lower values render first.
   */
  weight?: number;

  /**
   * the action's component, receiving the currently open email.
   */
  component: ComponentType<{ email: Email }>;
};

export type EmailActionSlot = SlotRegistry<EmailAction[]>;
