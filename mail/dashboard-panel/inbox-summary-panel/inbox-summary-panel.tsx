import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Card } from '@lov/design.content.card';
import { TriageTiles } from '@lov/mail.ui.triage-tiles';
import { useTriageCounts, type TriageCounts } from '@lov/mail.hooks.use-emails';
import type { TriageBucket } from '@lov/mail.entities.email';
import styles from './inbox-summary-panel.module.scss';

export type InboxSummaryPanelProps = {
  /**
   * provide mock triage counts to bypass the network request, useful for tests and compositions.
   */
  mockCounts?: TriageCounts;

  /**
   * base path to navigate to when a tile is selected. the selected bucket is appended as a query param.
   */
  inboxPath?: string;

  /**
   * class name for the panel root element.
   */
  className?: string;

  /**
   * inline style for the panel root element.
   */
  style?: React.CSSProperties;
};

/**
 * Dashboard panel showing the four triage tiles with live counts. Selecting a tile navigates
 * to the inbox pre-filtered to that bucket.
 */
export function InboxSummaryPanel({
  mockCounts,
  inboxPath = `/inbox`,
  className,
  style,
}: InboxSummaryPanelProps) {
  const navigate = useNavigate();
  const [active, setActive] = useState<TriageBucket | 'all'>(`all`);
  const { counts, loading } = useTriageCounts({ mockData: mockCounts });

  const handleSelect = (bucket: TriageBucket | 'all') => {
    setActive(bucket);
    if (bucket === `all`) return;
    navigate(`${inboxPath}?bucket=${bucket}`);
  };

  return (
    <Card title="📥 Inbox summary" className={classNames(styles.panel, className)} style={style}>
      <TriageTiles
        counts={counts}
        active={active}
        loading={loading}
        onSelect={(bucket) => handleSelect(bucket)}
      />
    </Card>
  );
}
