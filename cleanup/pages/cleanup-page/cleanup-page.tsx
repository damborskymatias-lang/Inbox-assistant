import React from 'react';
import classNames from 'classnames';
import { ProtectedRoute } from '@lov/inbox-platform.ui.protected-route';
import { type User } from '@lov/inbox-platform.entities.user';
import { PageLayout } from '@lov/design.layouts.page-layout';
import { EmptyState } from '@lov/design.content.empty-state';
import { SkeletonList } from '@lov/design.loaders.skeleton';
import { useCleanupSuggestions, useExecuteSuggestion } from '@lov/cleanup.hooks.use-cleanup-suggestions';
import { CleanupSuggestionCard } from '@lov/cleanup.ui.cleanup-suggestion-card';
import type { CleanupSuggestion, PlainCleanupSuggestion } from '@lov/cleanup.entities.cleanup-suggestion';
import styles from './cleanup-page.module.scss';

export type CleanupPageProps = {
  /**
   * mock cleanup suggestions bypassing the network request, useful for tests and compositions.
   */
  mockSuggestions?: CleanupSuggestion[];

  /**
   * whether the current user has an active pro subscription.
   */
  isPro?: boolean;

  /**
   * mock user bypassing the auth network request, useful for tests and compositions.
   */
  mockUser?: User;

  /**
   * path anonymous visitors are redirected to.
   */
  redirectTo?: string;

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
 * Protected page listing all detected cleanup suggestions as cards, with a header summarizing
 * total emails that can be cleared and estimated minutes saved. Shows skeletons while detecting
 * and a celebratory empty state when nothing matches.
 */
export function CleanupPage({
  mockSuggestions,
  isPro = false,
  mockUser,
  redirectTo = `/login`,
  className,
  style,
}: CleanupPageProps) {
  const { suggestions, loading, error } = useCleanupSuggestions({ mockData: mockSuggestions });
  const { executeSuggestion } = useExecuteSuggestion();

  const totalEmails = suggestions.reduce((sum, suggestion) => sum + suggestion.count, 0);
  const totalMinutes = suggestions.reduce((sum, suggestion) => sum + suggestion.estimatedMinutesSaved, 0);

  const headerActions = !loading && suggestions.length > 0 && (
    <div className={styles.stats}>
      <div className={styles.stat}>
        <span className={styles.statValue}>{totalEmails}</span>
        <span className={styles.statLabel}>emails to clear</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.statValue}>{`~${totalMinutes}m`}</span>
        <span className={styles.statLabel}>estimated saved</span>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return <SkeletonList variant="panel" count={3} />;
    }

    if (suggestions.length === 0) {
      return (
        <EmptyState
          icon="🎉"
          title="Your inbox is already clean 🎉"
          description="We didn't find any newsletters or old promotions worth clearing right now."
        />
      );
    }

    return (
      <div className={styles.cardsList}>
        {error && <p className={styles.errorText}>Some suggestions may be out of date.</p>}
        {suggestions.map((suggestion) => {
          const plainSuggestion: PlainCleanupSuggestion = suggestion.toObject();
          return (
            <CleanupSuggestionCard
              key={plainSuggestion.id}
              suggestion={plainSuggestion}
              isPro={isPro}
              onExecute={(id) =>
                executeSuggestion(id).then(
                  (result) =>
                    result || {
                      id,
                      affected: plainSuggestion.count,
                      action: plainSuggestion.action,
                      minutesSaved: plainSuggestion.estimatedMinutesSaved,
                    }
                )
              }
            />
          );
        })}
      </div>
    );
  };

  return (
    <ProtectedRoute mockUser={mockUser} redirectTo={redirectTo}>
      <div className={classNames(styles.page, className)} style={style}>
        <PageLayout
          title="Cleanup suggestions"
          subtitle="AI detected emails you can safely archive or delete to keep your inbox tidy."
          actions={headerActions || undefined}
        >
          {renderContent()}
        </PageLayout>
      </div>
    </ProtectedRoute>
  );
}
