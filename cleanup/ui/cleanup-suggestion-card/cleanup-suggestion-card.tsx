import React, { useState } from 'react';
import classNames from 'classnames';
import { Card } from '@lov/design.content.card';
import { Badge } from '@lov/design.content.badge';
import { Paragraph } from '@lov/design.typography.paragraph';
import { Button } from '@lov/design.actions.button';
import { ConfirmDialog } from '@lov/design.overlays.confirm-dialog';
import { BoxArchiveIcon, TrashBulkIcon, SparkleCleanIcon } from '@lov/cleanup.icons.cleanup-icons';
import type { PlainCleanupSuggestion, CleanupResult } from '@lov/cleanup.entities.cleanup-suggestion';
import styles from './cleanup-suggestion-card.module.scss';

export type CleanupSuggestionCardProps = {
  /**
   * the cleanup suggestion rendered by the card.
   */
  suggestion?: PlainCleanupSuggestion;

  /**
   * called with the suggestion id once the user confirms the action; should resolve with the cleanup result.
   */
  onExecute?: (id: string) => Promise<CleanupResult>;

  /**
   * whether the current user has an active pro subscription.
   */
  isPro?: boolean;

  /**
   * class name for the card root element.
   */
  className?: string;

  /**
   * style for the card root element.
   */
  style?: React.CSSProperties;
};

type CardStage = 'idle' | 'confirming' | 'loading' | 'success' | 'error';

const DEFAULT_SUGGESTION: PlainCleanupSuggestion = {
  id: `suggestion-newsletters`,
  rule: `newsletters`,
  label: `42 newsletters detected`,
  description: `Newsletters and promotions from the last 30 days.`,
  count: 42,
  action: `archive`,
  estimatedMinutesSaved: 24,
  pro: false,
};

/**
 * A single AI cleanup suggestion rendered as a warm-tinted banner, with a confirm dialog gate
 * before executing, a success state once the cleanup completes, and a pro upgrade prompt for
 * gated suggestions.
 */
export function CleanupSuggestionCard({
  suggestion = DEFAULT_SUGGESTION,
  onExecute,
  isPro = false,
  className,
  style,
}: CleanupSuggestionCardProps) {
  const [stage, setStage] = useState<CardStage>('idle');
  const [result, setResult] = useState<CleanupResult | undefined>(undefined);

  const isLocked = suggestion.pro && !isPro;
  const isDelete = suggestion.action === 'delete';
  const actionVerb = isDelete ? `Delete` : `Archive`;
  const noun = suggestion.count === 1 ? `email` : `emails`;
  const isDialogOpen = stage === 'confirming' || stage === 'loading';

  const handleConfirm = () => {
    if (!onExecute) {
      setResult({
        id: suggestion.id,
        affected: suggestion.count,
        action: suggestion.action,
        minutesSaved: suggestion.estimatedMinutesSaved,
      });
      setStage('success');
      return;
    }

    setStage('loading');
    onExecute(suggestion.id)
      .then((cleanupResult) => {
        setResult(cleanupResult);
        setStage('success');
      })
      .catch(() => {
        setStage('error');
      });
  };

  if (stage === 'success' && result) {
    return (
      <Card
        tone="success"
        padding="md"
        className={classNames(styles.card, styles.flipped, className)}
        style={style}
      >
        <div className={styles.successRow}>
          <span className={styles.successIcon}>
            <SparkleCleanIcon size="sm" color="var(--colors-status-positive-default)" />
          </span>
          <div className={styles.successCopy}>
            <Paragraph size="sm" weight="semiBold" tone="success">
              {`${isDelete ? 'Deleted' : 'Archived'} — ${result.affected} emails cleared`}
            </Paragraph>
            <Paragraph size="xs" tone="muted">
              {`~${result.minutesSaved} minutes saved`}
            </Paragraph>
          </div>
          <Badge tone="success" icon="✅" size="sm" className={styles.successBadge}>
            Done
          </Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card tone="warning" padding="md" className={classNames(styles.card, className)} style={style}>
      <div className={styles.row}>
        <Paragraph size="sm" className={styles.label}>
          {`🧹 ${suggestion.label} from the last 30 days`}
        </Paragraph>

        {isLocked ? (
          <div className={styles.lockedActions}>
            <Badge tone="neutral" icon="🔒" size="sm">
              Pro
            </Badge>
            <Paragraph size="xs" tone="muted" className={styles.upgradeCopy}>
              Upgrade to Pro to unlock this cleanup
            </Paragraph>
          </div>
        ) : (
          <Button
            variant={isDelete ? 'danger' : 'primary'}
            size="sm"
            loading={stage === 'loading'}
            iconStart={isDelete ? <TrashBulkIcon size="sm" title="" /> : <BoxArchiveIcon size="sm" title="" />}
            onClick={() => setStage('confirming')}
          >
            {`${actionVerb} all`}
          </Button>
        )}
      </div>

      {stage === 'error' && (
        <Paragraph size="xs" tone="danger" className={styles.errorCopy}>
          Something went wrong. Please try again.
        </Paragraph>
      )}

      <ConfirmDialog
        open={isDialogOpen}
        tone={isDelete ? 'danger' : 'default'}
        title={`${actionVerb} ${suggestion.count} ${noun}?`}
        description={suggestion.description}
        confirmLabel={`${actionVerb} all`}
        cancelLabel="Not now"
        loading={stage === 'loading'}
        onConfirm={() => handleConfirm()}
        onCancel={() => setStage('idle')}
      />
    </Card>
  );
}
