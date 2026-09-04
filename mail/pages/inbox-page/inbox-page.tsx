import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { ProtectedRoute } from '@lov/inbox-platform.ui.protected-route';
import { type User } from '@lov/inbox-platform.entities.user';
import { PageLayout } from '@lov/design.layouts.page-layout';
import { SplitLayout } from '@lov/design.layouts.split-layout';
import { Card } from '@lov/design.content.card';
import { TextInput } from '@lov/design.inputs.text-input';
import { Button } from '@lov/design.actions.button';
import { TriageTiles } from '@lov/mail.ui.triage-tiles';
import { EmailList } from '@lov/mail.ui.email-list';
import { EmailReader } from '@lov/mail.ui.email-reader';
import { MailIcons } from '@lov/mail.icons.mail-icons';
import type { Email, TriageBucket } from '@lov/mail.entities.email';
import {
  useEmails,
  useEmail,
  useTriageCounts,
  useArchiveEmails,
  useDeleteEmails,
  useSendReply,
  useSyncEmails,
  type TriageCounts,
} from '@lov/mail.hooks.use-emails';
import { SearchIcon } from './search-icon.js';
import type { EmailAction } from './email-action-type.js';
import styles from './inbox-page.module.scss';

const DEFAULT_EMAIL_ACTIONS: EmailAction[] = [];

export type InboxPageProps = {
  /**
   * email actions registered by feature aspects (for example Generate Reply), rendered into the
   * reader toolbar for the currently selected email.
   */
  emailActions?: EmailAction[];

  /**
   * path anonymous visitors are redirected to.
   */
  redirectTo?: string;

  /**
   * mock user bypassing the auth network request, useful for tests and compositions.
   */
  mockUser?: User;

  /**
   * mock emails bypassing the network request, useful for tests and compositions.
   */
  mockEmailsData?: Email[];

  /**
   * mock triage counts bypassing the network request, useful for tests and compositions.
   */
  mockTriageCounts?: TriageCounts;

  /**
   * mock full email bypassing the network request for the selected email, useful for tests and
   * compositions.
   */
  mockSelectedEmail?: Email;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * The main inbox page at /inbox. Composes triage tiles for filtering, a search input, a sync
 * button, and a split layout with the email list on the left and the reader on the right. Manages
 * selected email and active bucket state, wires archive, delete and send through the mail hooks,
 * and renders registered email actions into the reader toolbar.
 */
export function InboxPage({
  emailActions = DEFAULT_EMAIL_ACTIONS,
  redirectTo = `/login`,
  mockUser,
  mockEmailsData,
  mockTriageCounts,
  mockSelectedEmail,
  className,
  style,
}: InboxPageProps) {
  const [activeBucket, setActiveBucket] = useState<TriageBucket | 'all'>(`all`);
  const [search, setSearch] = useState(``);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [replyBody, setReplyBody] = useState(``);
  const [replySent, setReplySent] = useState(false);

  const { emails, loading: emailsLoading } = useEmails({
    bucket: activeBucket === `all` ? undefined : activeBucket,
    search: search.trim() || undefined,
    mockData: mockEmailsData,
  });

  const { counts, loading: countsLoading } = useTriageCounts({ mockData: mockTriageCounts });

  const { email: selectedEmail } = useEmail(selectedId || ``, { mockData: mockSelectedEmail });

  const { archiveEmails } = useArchiveEmails();
  const { deleteEmails } = useDeleteEmails();
  const { sendReply, loading: sendLoading } = useSendReply();
  const { syncEmails, loading: syncLoading } = useSyncEmails();

  useEffect(() => {
    if (emails.length === 0) return;
    const stillPresent = emails.some((email) => email.id === selectedId);
    if (!stillPresent) {
      setSelectedId(emails[0].id);
    }
  }, [emails, selectedId]);

  useEffect(() => {
    setReplyBody(``);
    setReplySent(false);
  }, [selectedId]);

  const unreadCount = useMemo(() => emails.filter((email) => !email.read).length, [emails]);

  const sortedActions = useMemo(
    () => [...emailActions].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0)),
    [emailActions]
  );

  const actionElements = useMemo(() => {
    if (!selectedEmail) return [];
    return sortedActions.map((action) => {
      const ActionComponent = action.component;
      return <ActionComponent key={action.name} email={selectedEmail} />;
    });
  }, [sortedActions, selectedEmail]);

  const handleArchive = async (id: string) => {
    await archiveEmails([id]);
    if (id === selectedId) {
      setSelectedId(undefined);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteEmails([id]);
    if (id === selectedId) {
      setSelectedId(undefined);
    }
  };

  const handleSendReply = async () => {
    const body = replyBody.trim();
    if (!selectedId || !body) return;
    await sendReply(selectedId, body);
    setReplyBody(``);
    setReplySent(true);
  };

  const listColumn = (
    <EmailList
      emails={emails.map((email) => email.toObject())}
      selectedId={selectedId}
      loading={emailsLoading}
      onSelect={(id) => setSelectedId(id)}
      onArchive={(id) => handleArchive(id)}
      onDelete={(id) => handleDelete(id)}
    />
  );

  const detailColumn = (
    <div className={styles.detailColumn}>
      <EmailReader
        email={selectedEmail?.toObject()}
        actions={actionElements}
        onArchive={() => selectedId && handleArchive(selectedId)}
        onDelete={() => selectedId && handleDelete(selectedId)}
      />
      {selectedEmail && (
        <Card title="Quick reply" padding="md" className={styles.replyCard}>
          <div className={styles.replyRow}>
            <TextInput
              placeholder="Write a quick reply…"
              value={replyBody}
              onChange={(value) => setReplyBody(value)}
              className={styles.replyField}
            />
            <Button
              variant="primary"
              loading={sendLoading}
              disabled={!replyBody.trim()}
              onClick={() => handleSendReply()}
            >
              Send
            </Button>
          </div>
          {replySent && <p className={styles.replySentNote}>Reply sent to {selectedEmail.sender}.</p>}
        </Card>
      )}
    </div>
  );

  return (
    <ProtectedRoute mockUser={mockUser} redirectTo={redirectTo}>
      <div className={classNames(styles.page, className)} style={style}>
        <PageLayout
          title="Inbox"
          subtitle={`${counts?.total ?? emails.length} emails · ${unreadCount} unread`}
          actions={
            <Button
              variant="secondary"
              size="sm"
              iconStart={<MailIcons name="sync" size="sm" className={styles.syncIcon} />}
              loading={syncLoading}
              onClick={() => syncEmails()}
            >
              Sync
            </Button>
          }
        >
          <div className={styles.toolbar}>
            <TriageTiles counts={counts} active={activeBucket} onSelect={setActiveBucket} loading={countsLoading} />
            <div className={styles.searchRow}>
              <TextInput
                type="search"
                placeholder="Search your inbox"
                iconStart={<SearchIcon />}
                clearable
                value={search}
                onChange={(value) => setSearch(value)}
                className={styles.searchField}
              />
            </div>
          </div>

          <SplitLayout list={listColumn} detail={detailColumn} hasSelection={Boolean(selectedId)} />
        </PageLayout>
      </div>
    </ProtectedRoute>
  );
}
