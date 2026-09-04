import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Button } from '@lov/design.actions.button';
import { Textarea } from '@lov/design.inputs.textarea';
import { DraftingIndicator } from '@lov/design.loaders.spinner';
import { SelectList, type SelectOption } from '@lov/design.inputs.select-list';
import { RegenerateIcon } from '@lov/assistant.icons.assistant-icons';
import { Paragraph } from '@lov/design.typography.paragraph';
import { useReplyDraft } from '@lov/assistant.hooks.use-reply-draft';
import { mockEmail } from '@lov/mail.entities.email';
import type { PlainEmail } from '@lov/mail.entities.email';
import type { ReplyTone } from '@lov/assistant.entities.reply-draft';
import styles from './reply-composer.module.scss';

const DEFAULT_EMAIL: PlainEmail = mockEmail({
  id: 'e1',
  sender: 'John Carter',
  senderEmail: 'john@northwind.io',
  subject: 'Project update for Q3 rollout?',
  body: `Hi Peter,\n\nCould you share where we stand on the Q3 rollout? The steering committee meets Thursday and I would like to bring numbers.\n\nThanks,\nJohn`,
  category: 'work',
  importance: 9,
  needsReply: true,
}).toObject();

const TONE_OPTIONS: SelectOption[] = [
  { value: `friendly`, label: `Friendly` },
  { value: `formal`, label: `Formal` },
  { value: `concise`, label: `Concise` },
  { value: `warm`, label: `Warm` },
];

const TONE_LABELS: Record<ReplyTone, string> = {
  friendly: `friendly`,
  formal: `formal`,
  concise: `concise`,
  warm: `warm`,
};

const MINUTES_SAVED = 4;

export type ReplyComposerProps = {
  /**
   * the email to generate and send an AI reply for.
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
 * The AI reply generator: a '✨ Generate Reply' button that drafts a reply in the user's writing
 * style, an editable textarea with send/regenerate/discard actions and a tone selector, a success
 * confirmation once sent, and an upgrade prompt when the AI reply quota has been exhausted.
 */
export function ReplyComposer({ email = DEFAULT_EMAIL, onSent, className, style }: ReplyComposerProps) {
  const { draft, generating, error, generate, regenerate, discard } = useReplyDraft();
  const [editedBody, setEditedBody] = useState(``);
  const [tone, setTone] = useState<ReplyTone>(`friendly`);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (draft) {
      setEditedBody(draft.body);
      setTone(draft.tone);
      setSent(false);
    }
  }, [draft]);

  const handleGenerate = () => {
    setSent(false);
    generate(email.id);
  };

  const handleToneChange = (nextValue: string) => {
    const nextTone = nextValue as ReplyTone;
    setTone(nextTone);
    generate(email.id, `Write the reply in a ${TONE_LABELS[nextTone]} tone.`);
  };

  const handleRegenerate = () => {
    setSent(false);
    regenerate();
  };

  const handleDiscard = () => {
    discard();
    setEditedBody(``);
    setSent(false);
  };

  const handleSend = () => {
    setSent(true);
    onSent?.(email, MINUTES_SAVED);
  };

  const senderFirstName = email.sender.split(` `)[0];

  if (error?.quotaExceeded) {
    return (
      <div className={classNames(styles.composer, className)} style={style}>
        <div className={styles.upgradePrompt}>
          <Paragraph size="md" weight="semiBold">
            You have reached your AI reply limit
          </Paragraph>
          <Paragraph size="sm" tone="soft">
            Upgrade your plan to keep generating replies in your writing style, instantly.
          </Paragraph>
          <Button variant="primary" size="sm" href="/settings/billing" className={styles.upgradeAction}>
            Upgrade plan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.composer, className)} style={style}>
      {!draft && !generating && (
        <Button variant="primary" onClick={() => handleGenerate()}>
          ✨ Generate Reply
        </Button>
      )}

      {!draft && !generating && error && (
        <Paragraph size="sm" tone="danger" className={styles.errorText}>
          {error.message}
        </Paragraph>
      )}

      {generating && (
        <div className={styles.draftingRow}>
          <DraftingIndicator />
        </div>
      )}

      {draft && !sent && !generating && (
        <div className={styles.draftSection}>
          <Textarea
            label="AI generated reply"
            value={editedBody}
            onChange={(nextValue) => setEditedBody(nextValue)}
            minRows={6}
            autoGrow
            showCount
            helperText="Edit anything before sending — the assistant learns from your changes."
          />
          <div className={styles.actionsRow}>
            <Button variant="primary" onClick={() => handleSend()}>
              📤 Send reply
            </Button>
            <Button
              variant="secondary"
              iconStart={<RegenerateIcon size="sm" />}
              onClick={() => handleRegenerate()}
            >
              Regenerate
            </Button>
            <Button variant="ghost" onClick={() => handleDiscard()}>
              Discard
            </Button>
          </div>
          <div className={styles.toneRow}>
            <SelectList
              label="Tone"
              options={TONE_OPTIONS}
              value={tone}
              onChange={(nextValue) => handleToneChange(nextValue)}
            />
          </div>
        </div>
      )}

      {sent && (
        <div className={styles.sentNote}>
          <Paragraph size="sm" tone="success" weight="medium">
            ✅ Reply sent to {senderFirstName}. ~{MINUTES_SAVED} minutes saved.
          </Paragraph>
        </div>
      )}
    </div>
  );
}
