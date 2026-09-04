import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { StopwatchIcon } from './stopwatch-icon.js';
import { TrendUpIcon } from './trend-up-icon.js';
import { DigestIcon } from './digest-icon.js';
import { BellIcon } from './bell-icon.js';
import { TargetIcon } from './target-icon.js';
import styles from './productivity-icons.compositions.module.scss';

export const AllProductivityIcons = () => {
  const icons: Array<{ label: string; Icon: typeof StopwatchIcon }> = [
    { label: `Stopwatch`, Icon: StopwatchIcon },
    { label: `Trend up`, Icon: TrendUpIcon },
    { label: `Digest`, Icon: DigestIcon },
    { label: `Bell`, Icon: BellIcon },
    { label: `Target`, Icon: TargetIcon },
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

export const IconSizesAndColors = () => {
  return (
    <MemoryRouter>
      <div className={styles.row}>
        <StopwatchIcon size="xs" color="secondary" title="Stopwatch extra small" />
        <StopwatchIcon size="sm" color="primary" title="Stopwatch small" />
        <TrendUpIcon size="md" color="positive" title="Trend up medium" />
        <DigestIcon size="lg" color="default" title="Digest large" />
        <TargetIcon size={32} color="urgent" title="Target custom size" />
      </div>
    </MemoryRouter>
  );
};

export const ProductivityDashboardExample = () => {
  return (
    <MemoryRouter>
      <div className={styles.stack}>
        <div className={styles.card}>
          <StopwatchIcon size="sm" color="primary" title="Time saved" />
          <span>You saved ~24 minutes today</span>
        </div>
        <div className={styles.card}>
          <TrendUpIcon size="sm" color="positive" title="Productivity trend" />
          <span>Productivity up 18% this week</span>
        </div>
        <div className={styles.card}>
          <DigestIcon size="sm" color="secondary" title="Daily digest" />
          <span>Today&apos;s digest is ready</span>
        </div>
        <div className={styles.card}>
          <BellIcon size="sm" color="warning" title="Notifications" />
          <span>3 new notifications</span>
        </div>
        <div className={styles.card}>
          <TargetIcon size="sm" color="urgent" title="Daily goal" />
          <span>Daily reply goal: 8 / 10</span>
        </div>
      </div>
    </MemoryRouter>
  );
};
