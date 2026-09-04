import React from 'react';
import type { DashboardPanel } from './dashboard-panel-type.js';
import styles from './dashboard.mock.module.scss';

function DailySummaryPanel() {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Daily summary</h3>
      <p className={styles.cardText}>
        You have <strong>12 new emails</strong>. 3 are urgent and need a reply today.
      </p>
    </div>
  );
}

function InboxTilesPanel() {
  return (
    <div className={styles.tiles}>
      <div className={styles.tile}>
        <div className={styles.tileCount}>3</div>
        <div className={styles.tileLabel}>Urgent</div>
      </div>
      <div className={styles.tile}>
        <div className={styles.tileCount}>7</div>
        <div className={styles.tileLabel}>Needs reply</div>
      </div>
      <div className={styles.tile}>
        <div className={styles.tileCount}>14</div>
        <div className={styles.tileLabel}>FYI</div>
      </div>
      <div className={styles.tile}>
        <div className={styles.tileCount}>42</div>
        <div className={styles.tileLabel}>Promotions</div>
      </div>
    </div>
  );
}

function CleanupPanel() {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Cleanup suggestions</h3>
      <p className={styles.cardText}>🧹 42 newsletters detected from the last 30 days.</p>
    </div>
  );
}

function SuggestedActionsPanel() {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Suggested first actions</h3>
      <p className={styles.cardText}>Reply to Sarah about the contract renewal.</p>
    </div>
  );
}

export const mockDashboardPanels: DashboardPanel[] = [
  { name: `daily-summary`, component: DailySummaryPanel, weight: 1, span: `full` },
  { name: `inbox-tiles`, component: InboxTilesPanel, weight: 2, span: `full` },
  { name: `cleanup`, component: CleanupPanel, weight: 3, span: `half` },
  { name: `suggested-actions`, component: SuggestedActionsPanel, weight: 4, span: `half` },
];
