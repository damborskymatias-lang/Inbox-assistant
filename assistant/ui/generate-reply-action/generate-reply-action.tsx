import React, { useState } from 'react';
import classNames from 'classnames';
import { Button } from '@lov/design.actions.button';
import { SparklesIcon } from '@lov/assistant.icons.assistant-icons';
import { ReplyComposer } from '@lov/assistant.ui.reply-composer';
import { mockEmail } from '@lov/mail.entities.email';
import type { PlainEmail } from '@lov/mail.entities.email';
import styles from './generate-reply-action.module.scss';

const DEFAULT_EMAIL: PlainEmail = mockEmail({
  id: `e1`,
  sender: `John Carter`,
  senderEmail: `john@northwind.io`,
  subject: `Project update for Q3 rollout?`,
  body: `Hi Peter,\n\nCould you share where we stand on the Q3 rollout? The steering committee meets Thursday and I would like to bring numbers.\n\nThanks,\nJohn`,
  category: `work`,
  importance: 9,
  needsReply: true,
}).toObject();

export type GenerateReplyActionProps = {
  /**
   * the currently open email this action applies to.
   */
  email?: PlainEmail;

  /**
   * called after the reply has been sent, with the replied-to email and the estimated minutes saved.
   */
  onSent?: (email: PlainEmail, minutesSaved: number) => void;

  /**
   * class name to override the container styles.
   */
  className?: string;

  /**
   * style for layout and positioning purposes.
   */
  style?: React.CSSProperties;
};

/**
 * Thin wrapper registered into the mail EmailAction slot: renders a 'Generate Reply' entry point
 * in the reader toolbar and, once activated, expands the AI reply composer inline below it.
 */
export function GenerateReplyAction({ email = DEFAULT_EMAIL, onSent, className, style }: GenerateReplyActionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <div className={classNames(styles.action, className)} style={style}>
        <Button
          variant="primary"
          size="sm"
          iconStart={<SparklesIcon size="sm" />}
          onClick={() => setExpanded(true)}
        >
          Generate Reply
        </Button>
      </div>
    );
  }

  return (
    <div className={classNames(styles.expanded, className)} style={style}>
      <ReplyComposer email={email} onSent={(sentEmail, minutesSaved) => onSent?.(sentEmail, minutesSaved)} />
    </div>
  );
}
