import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Link } from '@lov/design.navigation.link';
import {
  useCleanupSuggestions,
  useExecuteSuggestion,
  type UseCleanupSuggestionsOptions,
} from '@lov/cleanup.hooks.use-cleanup-suggestions';
import { CleanupSuggestionCard, type CleanupSuggestionCardProps } from '@lov/cleanup.ui.cleanup-suggestion-card';
import styles from './cleanup-panel.module.scss';

export type CleanupPanelProps = {
  /**
   * whether the current user has an active pro subscription, used to unlock pro-gated suggestions.
   */
  isPro?: boolean;

  /**
   * destination for the "See all cleanups" link.
   */
  cleanupHref?: string;

  /**
   * mock cleanup suggestions bypassing the network request, useful for tests and compositions.
   */
  mockSuggestions?: UseCleanupSuggestionsOptions['mockData'];

  /**
   * class name for the panel root element.
   */
  className?: string;

  /**
   * style for the panel root element.
   */
  style?: React.CSSProperties;
};

/**
 * Dashboard panel surfacing the single highest-impact cleanup suggestion inline, matching the
 * prototype's warm-tinted banner, along with a link to review every cleanup suggestion. The panel
 * renders nothing while loading or when there are no suggestions available.
 */
export function CleanupPanel({
  isPro = false,
  cleanupHref = `/cleanup`,
  mockSuggestions,
  className,
  style,
}: CleanupPanelProps) {
  const { suggestions, loading } = useCleanupSuggestions({ mockData: mockSuggestions });
  const { executeSuggestion } = useExecuteSuggestion();

  const topSuggestion = useMemo(() => {
    if (suggestions.length === 0) return undefined;

    return [...suggestions].sort((a, b) => b.estimatedMinutesSaved - a.estimatedMinutesSaved)[0];
  }, [suggestions]);

  if (loading || !topSuggestion) return null;

  const suggestion: CleanupSuggestionCardProps['suggestion'] = topSuggestion.toObject();

  return (
    <div className={classNames(styles.panel, className)} style={style}>
      <CleanupSuggestionCard
        suggestion={suggestion}
        isPro={isPro}
        className={styles.card}
        onExecute={(id) => executeSuggestion(id).then((result) => result || Promise.reject())}
      />
      <div className={styles.footer}>
        <Link href={cleanupHref} className={styles.link}>
          See all cleanups
        </Link>
      </div>
    </div>
  );
}
