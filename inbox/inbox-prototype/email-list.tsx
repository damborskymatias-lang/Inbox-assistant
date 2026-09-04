import { Badge, type BadgeTone } from '@lov/design.content.badge';
import { Paragraph } from '@lov/design.typography.paragraph';
import { EmptyState } from '@lov/design.content.empty-state';
import styles from './inbox-prototype.module.css';
import type { EmailCategory, InboxEmail, TriageBucket } from './inbox-types.js';

const CATEGORY: Record<EmailCategory, { label: string; emoji: string; tone: BadgeTone }> = {
  urgent: { label: 'Urgent', emoji: '🔴', tone: 'urgent' },
  work: { label: 'Work', emoji: '💼', tone: 'work' },
  bills: { label: 'Bills', emoji: '💰', tone: 'bills' },
  shopping: { label: 'Shopping', emoji: '🛒', tone: 'shopping' },
  family: { label: 'Family', emoji: '👨‍👩‍👧', tone: 'family' },
  marketing: { label: 'Marketing', emoji: '📢', tone: 'marketing' },
};

const STRIPE: Record<TriageBucket, string> = {
  urgent: 'var(--colors-triage-urgent-default, #e5484d)',
  needsReply: 'var(--colors-triage-needs-reply-default, #f5a524)',
  fyi: 'var(--colors-triage-fyi-default, #17a34a)',
  promotions: 'var(--colors-triage-promotions-default, #8b8fa3)',
};

export type EmailListProps = {
  /** Emails to display. */
  emails: InboxEmail[];
  /** Id of the currently open email. */
  selectedId?: string;
  /** Called when an email row is clicked. */
  onSelect: (email: InboxEmail) => void;
};

/**
 * Triage list of emails with AI summary, smart category and importance score.
 */
export function EmailList({ emails, selectedId, onSelect }: EmailListProps) {
  if (!emails.length) {
    return (
      <EmptyState
        icon="🎉"
        title="Inbox zero for this filter"
        description="Nothing here needs your attention right now."
      />
    );
  }

  return (
    <div className={styles.list}>
      {emails.map((email) => {
        const category = CATEGORY[email.category];
        return (
          <div
            key={email.id}
            role="button"
            tabIndex={0}
            className={`${styles.row} ${selectedId === email.id ? styles.rowActive : ''}`}
            onClick={() => onSelect(email)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') onSelect(email);
            }}
          >
            <span className={styles.stripe} style={{ background: STRIPE[email.bucket] }} />
            <div className={styles.rowMain}>
              <Paragraph size="sm" weight={email.read ? 'medium' : 'bold'}>
                {email.sender}
              </Paragraph>
              <Paragraph size="sm">{email.subject}</Paragraph>
              <Paragraph size="xs" tone="soft" truncate={2}>
                {email.summary}
              </Paragraph>
            </div>
            <div className={styles.rowMeta}>
              <Paragraph size="xs" tone="muted">
                {email.receivedAt}
              </Paragraph>
              <Badge tone={category.tone} icon={category.emoji}>
                {category.label}
              </Badge>
              <Paragraph size="xs" tone="muted">
                importance {email.importance}/10
              </Paragraph>
            </div>
          </div>
        );
      })}
    </div>
  );
}
