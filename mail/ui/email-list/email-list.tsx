import React from 'react';
import classNames from 'classnames';
import type { PlainEmail, TriageBucket } from '@lov/mail.entities.email';
import { SkeletonList } from '@lov/design.loaders.skeleton';
import { EmptyState } from '@lov/design.content.empty-state';
import { IconButton } from '@lov/design.actions.icon-button';
import { Paragraph } from '@lov/design.typography.paragraph';
import { CategoryChip, ImportanceBadge } from '@lov/mail.ui.category-chip';
import { MailIcons } from '@lov/mail.icons.mail-icons';
import { formatReceivedAt } from './format-received-at.js';
import styles from './email-list.module.scss';

const STRIPE_CLASS: Record<TriageBucket, string> = {
  urgent: styles.stripeUrgent,
  needsReply: styles.stripeNeedsReply,
  fyi: styles.stripeFyi,
  promotions: styles.stripePromotions,
};

export type EmailListProps = {
  /**
   * emails to display in the triage list.
   */
  emails?: PlainEmail[];

  /**
   * id of the currently selected/open email.
   */
  selectedId?: string;

  /**
   * whether the list is loading, renders skeleton rows when true.
   */
  loading?: boolean;

  /**
   * called when a row is clicked or activated.
   */
  onSelect?: (id: string) => void;

  /**
   * called when the archive action is triggered for a row.
   */
  onArchive?: (id: string) => void;

  /**
   * called when the delete action is triggered for a row.
   */
  onDelete?: (id: string) => void;

  /**
   * class name to override the root element.
   */
  className?: string;

  /**
   * style for layout and positioning purposes.
   */
  style?: React.CSSProperties;
};

/**
 * Scrollable triage list of email rows, showing sender, subject, the AI
 * summary line, received time, category and importance, with hover actions
 * to archive or delete each email.
 */
export function EmailList({
  emails = [],
  selectedId,
  loading = false,
  onSelect,
  onArchive,
  onDelete,
  className,
  style,
}: EmailListProps) {
  if (loading) {
    return <SkeletonList variant="email" count={5} className={classNames(styles.list, className)} style={style} />;
  }

  if (!emails.length) {
    return (
      <EmptyState
        icon="🎉"
        title="Inbox zero for this filter"
        description="Nothing here needs your attention right now."
        className={classNames(styles.empty, className)}
        style={style}
      />
    );
  }

  return (
    <div className={classNames(styles.list, className)} style={style}>
      {emails.map((email) => {
        const isSelected = selectedId === email.id;
        const isUnread = !email.read;
        const bucket = email.bucket;

        return (
          <div
            key={email.id}
            role="button"
            tabIndex={0}
            className={classNames(
              styles.row,
              isSelected && styles.rowSelected,
              isUnread && styles.rowUnread
            )}
            onClick={() => onSelect?.(email.id)}
            onKeyDown={(event) => {
              if (event.key === `Enter` || event.key === ` `) {
                onSelect?.(email.id);
              }
            }}
          >
            <span className={classNames(styles.stripe, STRIPE_CLASS[bucket])} />

            <div className={styles.content}>
              <div className={styles.topLine}>
                <div className={styles.senderLine}>
                  {isUnread && <span className={styles.unreadDot} />}
                  <Paragraph size="sm" weight={isUnread ? `bold` : `medium`} className={styles.sender}>
                    {email.sender}
                  </Paragraph>
                </div>
                <Paragraph size="xs" tone="muted" className={styles.time}>
                  {formatReceivedAt(email.receivedAt)}
                </Paragraph>
              </div>

              <Paragraph size="sm" weight={isUnread ? `semiBold` : `regular`} className={styles.subject}>
                {email.subject}
              </Paragraph>

              <Paragraph size="xs" tone="soft" truncate={2} className={styles.summary}>
                {email.summary || email.snippet}
              </Paragraph>

              <div className={styles.metaRow}>
                {email.category && <CategoryChip category={email.category} size="xs" />}
                {typeof email.importance === `number` && (
                  <ImportanceBadge score={email.importance} size="xs" />
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <IconButton
                icon={<MailIcons name="archive" size="sm" />}
                label="Archive email"
                size="sm"
                variant="ghost"
                onClick={() => onArchive?.(email.id)}
              />
              <IconButton
                icon={<MailIcons name="trash" size="sm" />}
                label="Delete email"
                size="sm"
                variant="danger"
                onClick={() => onDelete?.(email.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
