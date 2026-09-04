import React from 'react';
import classNames from 'classnames';
import { Card } from '@lov/design.content.card';
import { Heading } from '@lov/design.typography.heading';
import { Paragraph } from '@lov/design.typography.paragraph';
import { Button } from '@lov/design.actions.button';
import { Link } from '@lov/design.navigation.link';
import { Skeleton } from '@lov/design.loaders.skeleton';
import { RegenerateIcon } from '@lov/assistant.icons.assistant-icons';
import { mockDailySummary } from '@lov/assistant.entities.daily-summary';
import type { PlainDailySummary } from '@lov/assistant.entities.daily-summary';
import styles from './daily-summary-card.module.scss';

const DEFAULT_SUMMARY: PlainDailySummary = mockDailySummary().toObject();

export type DailySummaryCardProps = {
  /**
   * the AI generated daily summary data to render.
   */
  summary?: PlainDailySummary;

  /**
   * name of the signed-in user, used in the greeting.
   */
  name?: string;

  /**
   * shows skeleton placeholders while a new summary is being generated.
   */
  loading?: boolean;

  /**
   * called when the user requests to regenerate the summary.
   */
  onRegenerate?: () => void;

  /**
   * class name to override the card root element.
   */
  className?: string;

  /**
   * style for layout and positioning purposes.
   */
  style?: React.CSSProperties;
};

/**
 * The AI daily summary card shown at the top of the inbox dashboard, greeting the user,
 * highlighting what matters and suggesting first actions linked to the relevant emails.
 */
export function DailySummaryCard({
  summary = DEFAULT_SUMMARY,
  name = `Peter`,
  loading = false,
  onRegenerate,
  className,
  style,
}: DailySummaryCardProps) {
  const { totalNew, highlights, suggestedActions } = summary;

  return (
    <Card
      padding="lg"
      title="AI daily summary"
      actions={
        <Button
          variant="ghost"
          size="sm"
          iconStart={<RegenerateIcon size="sm" />}
          disabled={loading}
          onClick={() => onRegenerate?.()}
        >
          Regenerate
        </Button>
      }
      className={classNames(styles.card, className)}
      style={style}
    >
      {loading ? (
        <div className={styles.loadingState}>
          <Skeleton variant="text" width="55%" height="1.6rem" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="35%" height="0.85rem" />
          <Skeleton variant="text" lines={3} />
          <Skeleton variant="text" width="45%" height="0.85rem" />
          <Skeleton variant="text" lines={3} />
        </div>
      ) : (
        <>
          <Heading level={2} size="lg">
            Good morning, {name} 👋
          </Heading>
          <Paragraph size="md" tone="soft">
            You have <strong>{totalNew} new emails</strong>. Here is what actually matters.
          </Paragraph>

          {highlights && highlights.length > 0 && (
            <>
              <div className={styles.sectionLabel}>Important</div>
              <ul className={styles.bullets}>
                {highlights.map((highlight) => (
                  <li key={highlight}>
                    <Paragraph size="sm">{highlight}</Paragraph>
                  </li>
                ))}
              </ul>
            </>
          )}

          {suggestedActions && suggestedActions.length > 0 && (
            <>
              <div className={styles.sectionLabel}>Suggested first actions</div>
              <ol className={styles.orderedActions}>
                {suggestedActions.map((action) => (
                  <li key={action.label}>
                    {action.emailId ? (
                      <Link href={`/inbox/${action.emailId}`} className={styles.actionLink}>
                        <Paragraph size="sm" weight="medium">
                          {action.label}
                        </Paragraph>
                      </Link>
                    ) : (
                      <Paragraph size="sm" weight="medium">
                        {action.label}
                      </Paragraph>
                    )}
                  </li>
                ))}
              </ol>
            </>
          )}
        </>
      )}
    </Card>
  );
}
