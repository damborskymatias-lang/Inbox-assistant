import React, { useState } from 'react';
import classNames from 'classnames';
import { ProtectedRoute } from '@lov/inbox-platform.ui.protected-route';
import { type User } from '@lov/inbox-platform.entities.user';
import { PageLayout } from '@lov/design.layouts.page-layout';
import { Card } from '@lov/design.content.card';
import { Toggle } from '@lov/design.inputs.toggle';
import { SelectList } from '@lov/design.inputs.select-list';
import type { SelectOption } from '@lov/design.inputs.select-list';
import { DigestSummary } from '@lov/productivity.ui.digest-summary';
import {
  useDailyDigest,
  useDigestHistory,
  useDigestPreferences,
} from '@lov/productivity.hooks.use-daily-digest';
import type {
  DigestChannel,
  PlainDailyDigest,
  PlainDigestPreferences,
} from '@lov/productivity.entities.daily-digest';
import styles from './digest-page.module.scss';

const CHANNEL_OPTIONS: SelectOption[] = [
  { value: `push`, label: `Push notification` },
  { value: `email`, label: `Email` },
  { value: `both`, label: `Push & Email` },
];

const TIME_OPTIONS: SelectOption[] = [
  { value: `06:00`, label: `6:00 AM` },
  { value: `07:00`, label: `7:00 AM` },
  { value: `08:00`, label: `8:00 AM` },
  { value: `09:00`, label: `9:00 AM` },
  { value: `12:00`, label: `12:00 PM` },
  { value: `18:00`, label: `6:00 PM` },
];

export type DigestPageProps = {
  /**
   * mock user bypassing the auth network request, useful for tests and compositions.
   */
  mockUser?: User;

  /**
   * mock today's digest, bypassing the network request.
   */
  mockDigest?: PlainDailyDigest;

  /**
   * mock digest history for the trend chart, bypassing the network request.
   */
  mockHistory?: PlainDailyDigest[];

  /**
   * mock notification preferences, bypassing the network request.
   */
  mockPreferences?: PlainDigestPreferences;

  /**
   * path anonymous visitors are redirected to.
   */
  redirectTo?: string;

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
 * Protected page showing today's digest headline, the digest summary with the weekly
 * trend, and a notification preferences card for the daily digest.
 */
export function DigestPage({
  mockUser,
  mockDigest,
  mockHistory,
  mockPreferences,
  redirectTo = `/login`,
  className,
  style,
}: DigestPageProps) {
  const { digest, loading: digestLoading } = useDailyDigest({ mockData: mockDigest });
  const { digests: history } = useDigestHistory(7, { mockData: mockHistory });
  const { preferences, updatePreferences } = useDigestPreferences({ mockData: mockPreferences });
  const [savedAt, setSavedAt] = useState<string | undefined>(undefined);

  const enabled = preferences?.enabled ?? true;
  const channel = preferences?.channel ?? `email`;
  const timeOfDay = preferences?.timeOfDay ?? `08:00`;

  const minutesSaved = Math.round(digest?.minutesSaved ?? 24);

  const handleEnabledChange = (nextEnabled: boolean) => {
    updatePreferences({ enabled: nextEnabled })
      .then(() => setSavedAt(new Date().toISOString()))
      .catch(() => undefined);
  };

  const handleChannelChange = (nextChannel: string) => {
    const isValidChannel = CHANNEL_OPTIONS.some((option) => option.value === nextChannel);
    if (!isValidChannel) return;

    updatePreferences({ channel: nextChannel as DigestChannel })
      .then(() => setSavedAt(new Date().toISOString()))
      .catch(() => undefined);
  };

  const handleTimeOfDayChange = (nextTimeOfDay: string) => {
    updatePreferences({ timeOfDay: nextTimeOfDay })
      .then(() => setSavedAt(new Date().toISOString()))
      .catch(() => undefined);
  };

  return (
    <ProtectedRoute mockUser={mockUser} redirectTo={redirectTo}>
      <div className={classNames(styles.digestPage, className)} style={style}>
        <PageLayout title="Daily digest" subtitle="Your daily recap of time saved and inbox activity.">
          <div className={styles.content}>
            <div className={styles.headline}>
              <span className={styles.headlineIcon}>⏱</span>
              <div className={styles.headlineText}>
                <p className={styles.headlineTitle}>
                  You saved approximately {minutesSaved} minutes today
                </p>
                <p className={styles.headlineSubtitle}>
                  Based on replies sent, emails triaged and cleaned up by your assistant.
                </p>
              </div>
            </div>

            <DigestSummary digest={digest?.toObject()} history={history.map((day) => day.toObject())} loading={digestLoading} />

            <Card padding="lg" title="🔔 Notification preferences">
              <div className={styles.section}>
                <Toggle
                  checked={enabled}
                  onChange={(nextEnabled) => handleEnabledChange(nextEnabled)}
                  label="Daily digest"
                  description="Receive a summary of your most important emails every morning."
                />
              </div>

              <div className={classNames(styles.section, !enabled ? styles.sectionDisabled : undefined)}>
                <div className={styles.fieldsRow}>
                  <SelectList
                    label="Delivery channel"
                    options={CHANNEL_OPTIONS}
                    value={channel}
                    onChange={(nextChannel) => handleChannelChange(nextChannel)}
                    className={styles.field}
                  />
                  <SelectList
                    label="Delivery time"
                    options={TIME_OPTIONS}
                    value={timeOfDay}
                    onChange={(nextTimeOfDay) => handleTimeOfDayChange(nextTimeOfDay)}
                    className={styles.field}
                  />
                </div>
                {savedAt && <p className={styles.savedNote}>Preferences saved</p>}
              </div>
            </Card>
          </div>
        </PageLayout>
      </div>
    </ProtectedRoute>
  );
}
