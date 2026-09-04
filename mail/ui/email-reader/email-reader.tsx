import React from 'react';
import classNames from 'classnames';
import { Card } from '@lov/design.content.card';
import { Heading } from '@lov/design.typography.heading';
import { Paragraph } from '@lov/design.typography.paragraph';
import { Avatar } from '@lov/design.content.avatar';
import { IconButton } from '@lov/design.actions.icon-button';
import { EmptyState } from '@lov/design.content.empty-state';
import { ImportanceBadge } from '@lov/mail.ui.category-chip';
import { MailIcons } from '@lov/mail.icons.mail-icons';
import type { PlainEmail } from '@lov/mail.entities.email';
import styles from './email-reader.module.scss';

const DEFAULT_ACTIONS: React.ReactNode[] = [];

export type EmailReaderProps = {
  /**
   * the email currently open in the reading pane, if any.
   */
  email?: PlainEmail;

  /**
   * registered email actions rendered in the toolbar slot area, for example a Generate Reply action.
   */
  actions?: React.ReactNode[];

  /**
   * called when the archive toolbar button is clicked.
   */
  onArchive?: () => void;

  /**
   * called when the delete toolbar button is clicked.
   */
  onDelete?: () => void;

  /**
   * class name to override the reader root element.
   */
  className?: string;

  /**
   * style for layout and positioning purposes.
   */
  style?: React.CSSProperties;
};

/**
 * formats an ISO received timestamp as a short time for today,
 * or a short date for earlier emails.
 */
function formatReceivedAt(receivedAt: string): string {
  const date = new Date(receivedAt);
  if (Number.isNaN(date.getTime())) {
    return receivedAt;
  }

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: `2-digit`, minute: `2-digit` });
  }

  return date.toLocaleDateString([], { month: `short`, day: `numeric` });
}

/**
 * Reading pane for a single email, showing the sender, subject, received time,
 * importance and full body, with a toolbar for archive, delete and registered actions.
 */
export function EmailReader({
  email,
  actions = DEFAULT_ACTIONS,
  onArchive,
  onDelete,
  className,
  style,
}: EmailReaderProps) {
  if (!email) {
    return (
      <Card padding="lg" className={classNames(styles.emailReader, styles.empty, className)} style={style}>
        <EmptyState
          icon="✉️"
          title="No email selected"
          description="Pick an email from the list to read it and generate a reply."
        />
      </Card>
    );
  }

  return (
    <Card padding="lg" className={classNames(styles.emailReader, className)} style={style}>
      <div className={styles.head}>
        <div className={styles.identity}>
          <Avatar name={email.sender} size="md" />
          <div className={styles.identityText}>
            <Heading level={3} size="sm" className={styles.subject}>
              {email.subject}
            </Heading>
            <Paragraph size="xs" tone="soft" className={styles.meta}>
              {email.sender} &lt;{email.senderEmail}&gt; · {formatReceivedAt(email.receivedAt)}
            </Paragraph>
          </div>
        </div>
        <ImportanceBadge score={email.importance} />
      </div>

      <div className={styles.body}>
        <Paragraph size="sm" className={styles.bodyText}>
          {email.body}
        </Paragraph>
      </div>

      <div className={styles.toolbar}>
        <IconButton
          icon={<MailIcons name="archive" size="sm" />}
          label="Archive email"
          size="sm"
          onClick={() => onArchive?.()}
        />
        <IconButton
          icon={<MailIcons name="trash" size="sm" />}
          label="Delete email"
          size="sm"
          variant="danger"
          onClick={() => onDelete?.()}
        />
        {actions.length > 0 && (
          <div className={styles.actionsSlot}>
            {actions.map((action, index) => (
              <React.Fragment key={index}>{action}</React.Fragment>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
