import React from 'react';
import classNames from 'classnames';
import { useDailySummary } from '@lov/assistant.hooks.use-daily-summary';
import type { PlainDailySummary } from '@lov/assistant.entities.daily-summary';
import { useAuth } from '@lov/inbox-platform.hooks.use-auth';
import type { User } from '@lov/inbox-platform.entities.user';
import { DailySummaryCard } from '@lov/assistant.ui.daily-summary-card';
import styles from './daily-summary-panel.module.scss';

export type DailySummaryPanelProps = {
  /**
   * mock daily summary data, bypassing the GraphQL query. Useful for tests and compositions.
   */
  mockSummary?: PlainDailySummary;

  /**
   * mock signed-in user, bypassing the auth network request. Useful for tests and compositions.
   */
  mockUser?: User;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style property for spacing and positioning overrides.
   */
  style?: React.CSSProperties;
};

/**
 * Dashboard panel fetching today's AI daily summary and rendering it in the daily summary card,
 * greeting the signed-in user by their first name. Registered with the highest weight so it
 * sits at the top of the dashboard, spanning the full width of the grid.
 */
export function DailySummaryPanel({
  mockSummary,
  mockUser,
  className,
  style,
}: DailySummaryPanelProps) {
  const { summary, loading, regenerate } = useDailySummary({ mockData: mockSummary });
  const { user } = useAuth({ mockData: mockUser });
  const firstName = user?.name?.trim().split(' ')[0] || `there`;

  return (
    <div className={classNames(styles.panel, className)} style={style}>
      <DailySummaryCard
        summary={summary?.toObject()}
        name={firstName}
        loading={loading}
        onRegenerate={() => regenerate()}
      />
    </div>
  );
}
