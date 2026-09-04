import { useMemo, useState } from 'react';
import { Logo } from '@lov/design.content.logo';
import { Card } from '@lov/design.content.card';
import { Badge } from '@lov/design.content.badge';
import { Avatar } from '@lov/design.content.avatar';
import { Button } from '@lov/design.actions.button';
import { Paragraph } from '@lov/design.typography.paragraph';
import { PageLayout } from '@lov/design.layouts.page-layout';
import { SplitLayout } from '@lov/design.layouts.split-layout';
import { ConfirmDialog } from '@lov/design.overlays.confirm-dialog';
import styles from './inbox-prototype.module.css';
import { DailySummary } from './daily-summary.js';
import { InboxSummary } from './inbox-summary.js';
import { EmailList } from './email-list.js';
import { EmailReader } from './email-reader.js';
import { bucketCounts, dailyHighlights, mockEmails, suggestedActions } from './inbox.mock.js';

import type { InboxEmail, TriageBucket } from './inbox-types.js';

/**
 * The AI inbox assistant dashboard — summary, triage list, reader and cleanup.
 */
export function DashboardPage() {
  const [filter, setFilter] = useState<TriageBucket | 'all'>('all');
  const [selected, setSelected] = useState<InboxEmail | undefined>(mockEmails[0]);
  const [cleaned, setCleaned] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const emails = useMemo(
    () => (filter === 'all' ? mockEmails : mockEmails.filter((e) => e.bucket === filter)),
    [filter]
  );

  const total = 38;

  const listColumn = (
    <div className={styles.column}>
      <DailySummary
        name="Peter"
        total={total}
        highlights={dailyHighlights}
        actions={suggestedActions}
      />
      <InboxSummary counts={bucketCounts} active={filter} onSelect={setFilter} />
      <Card tone="warning">
        <div className={styles.cleanupRow}>
          <Paragraph size="sm">
            🧹 <strong>42 newsletters</strong> detected from the last 30 days.
          </Paragraph>
          {cleaned ? (
            <Badge tone="success" icon="✅">
              Archived — 42 emails cleared
            </Badge>
          ) : (
            <Button variant="primary" size="sm" onClick={() => setConfirming(true)}>
              Archive all
            </Button>
          )}
        </div>
      </Card>
      <Card title={`${filter === 'all' ? 'All email' : 'Filtered'} · ${emails.length} shown`}>
        <EmailList emails={emails} selectedId={selected?.id} onSelect={setSelected} />
      </Card>
    </div>
  );

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Logo size="md" />
        <div className={styles.headerRight}>
          <Badge tone="success" icon="⏱" size="sm">
            You saved ~24 minutes today
          </Badge>
          <Avatar name="Peter Novak" size="sm" />
        </div>
      </header>

      <main className={styles.main}>
        <PageLayout>
          <SplitLayout
            list={listColumn}
            detail={<EmailReader email={selected} />}
            hasSelection={Boolean(selected)}
          />
        </PageLayout>
      </main>

      <ConfirmDialog
        open={confirming}
        title="Archive 42 newsletters?"
        description="These are newsletters and promotions from the last 30 days. You can still find them in your Gmail archive."
        confirmLabel="Yes, archive all"
        onConfirm={() => {
          setCleaned(true);
          setConfirming(false);
        }}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
