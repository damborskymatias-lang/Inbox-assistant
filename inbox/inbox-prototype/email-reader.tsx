import { useEffect, useState } from 'react';
import { Card } from '@lov/design.content.card';
import { Heading } from '@lov/design.typography.heading';
import { Paragraph } from '@lov/design.typography.paragraph';
import { Button } from '@lov/design.actions.button';
import { IconButton } from '@lov/design.actions.icon-button';
import { Badge } from '@lov/design.content.badge';
import { Avatar } from '@lov/design.content.avatar';
import { Textarea } from '@lov/design.inputs.textarea';
import { EmptyState } from '@lov/design.content.empty-state';
import { DraftingIndicator } from '@lov/design.loaders.spinner';
import styles from './inbox-prototype.module.css';
import type { InboxEmail } from './inbox-types.js';

export type EmailReaderProps = {
  /** The email currently open, if any. */
  email?: InboxEmail;
};

/** Builds a mock AI reply for the given email. */
function draftReply(email: InboxEmail): string {
  const first = email.sender.split(' ')[0];
  if (email.category === 'family') {
    return `Hi ${first},\n\nSunday works for me — I'll be there around 1pm.\n\nLove,\nPeter`;
  }
  if (email.category === 'bills') {
    return `Hello,\n\nThanks for the notice. I'll complete the verification today.\n\nBest,\nPeter`;
  }
  return `Hi ${first},\n\nThanks for reaching out.\n\nI'll send you the project update tomorrow morning.\n\nBest,\nPeter`;
}

/**
 * Reading pane with the AI reply generator — generates a draft the user can edit and send.
 */
export function EmailReader({ email }: EmailReaderProps) {
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setDraft('');
    setLoading(false);
    setSent(false);
  }, [email?.id]);

  if (!email) {
    return (
      <Card>
        <EmptyState
          icon="✉️"
          title="No email selected"
          description="Pick an email from the list to read it and generate a reply."
        />
      </Card>
    );
  }

  const generate = () => {
    setLoading(true);
    setSent(false);
    setTimeout(() => {
      setDraft(draftReply(email));
      setLoading(false);
    }, 700);
  };

  return (
    <Card padding="lg">
      <div className={styles.readerHead}>
        <div className={styles.readerIdentity}>
          <Avatar name={email.sender} size="md" />
          <div>
            <Heading level={3} size="sm">
              {email.subject}
            </Heading>
            <Paragraph size="xs" tone="soft">
              {email.sender} &lt;{email.senderEmail}&gt; · {email.receivedAt}
            </Paragraph>
          </div>
        </div>
        <Badge tone={email.importance >= 8 ? 'urgent' : 'neutral'}>
          importance {email.importance}/10
        </Badge>
      </div>

      <div className={styles.body}>
        <Paragraph size="sm">{email.body}</Paragraph>
      </div>

      <div className={styles.readerToolbar}>
        <IconButton icon="🗂" label="Archive email" size="sm" />
        <IconButton icon="🗑" label="Delete email" size="sm" variant="danger" />
        {!draft && !loading && (
          <Button variant="primary" size="sm" iconStart="✨" onClick={generate}>
            Generate Reply
          </Button>
        )}
      </div>

      {loading && <DraftingIndicator />}

      {draft && !sent && (
        <>
          <Textarea
            label="AI generated reply"
            value={draft}
            onChange={setDraft}
            minRows={6}
            autoGrow
            showCount
            helperText="Edit anything before sending — the assistant learns from your changes."
          />
          <div className={styles.replyBar}>
            <Button variant="primary" iconStart="📤" onClick={() => setSent(true)}>
              Send reply
            </Button>
            <Button variant="secondary" iconStart="🔄" onClick={generate}>
              Regenerate
            </Button>
            <Button variant="ghost" onClick={() => setDraft('')}>
              Discard
            </Button>
          </div>
        </>
      )}

      {sent && (
        <div className={styles.sentNote}>
          <Paragraph size="sm" tone="success" weight="medium">
            ✅ Reply sent to {email.sender}. ~4 minutes saved.
          </Paragraph>
        </div>
      )}
    </Card>
  );
}
