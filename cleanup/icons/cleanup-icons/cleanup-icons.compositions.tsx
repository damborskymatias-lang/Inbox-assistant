import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { BroomIcon } from './broom-icon.js';
import { BoxArchiveIcon } from './box-archive-icon.js';
import { TrashBulkIcon } from './trash-bulk-icon.js';
import { NewsletterIcon } from './newsletter-icon.js';
import { SparkleCleanIcon } from './sparkle-clean-icon.js';
import styles from './cleanup-icons.compositions.module.scss';

export const AllCleanupIcons = () => {
  const icons: Array<{ label: string; Icon: typeof BroomIcon }> = [
    { label: `Broom`, Icon: BroomIcon },
    { label: `Box archive`, Icon: BoxArchiveIcon },
    { label: `Trash bulk`, Icon: TrashBulkIcon },
    { label: `Newsletter`, Icon: NewsletterIcon },
    { label: `Sparkle clean`, Icon: SparkleCleanIcon },
  ];

  return (
    <MemoryRouter>
      <div className={styles.grid}>
        {icons.map((item) => {
          const IconComponent = item.Icon;
          return (
            <div key={item.label} className={styles.cell}>
              <IconComponent size="lg" />
              <span className={styles.label}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </MemoryRouter>
  );
};

export const CleanupIconSizesAndColors = () => {
  return (
    <MemoryRouter>
      <div className={styles.row}>
        <BroomIcon size="xs" color="secondary" title="Broom extra small" />
        <BroomIcon size="sm" color="primary" title="Broom small" />
        <BroomIcon size="md" color="default" title="Broom medium" />
        <BroomIcon size="lg" color="promotions" title="Broom large" />
        <BroomIcon size={32} color="inherit" title="Broom custom size" />
      </div>
    </MemoryRouter>
  );
};

export const NewsletterCleanupCard = () => {
  return (
    <MemoryRouter>
      <div className={styles.cleanupCard}>
        <NewsletterIcon size="lg" color="promotions" title="Newsletters" />
        <span>42 newsletters detected from the last 30 days.</span>
        <BoxArchiveIcon size="md" color="primary" title="Archive all" />
        <TrashBulkIcon size="md" color="negative" title="Delete all" />
        <SparkleCleanIcon size="md" color="promotions" title="Inbox cleaned" />
      </div>
    </MemoryRouter>
  );
};
