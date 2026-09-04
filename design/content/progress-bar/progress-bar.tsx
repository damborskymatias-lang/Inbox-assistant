import React from 'react';
import classNames from 'classnames';
import styles from './progress-bar.module.scss';

export type ProgressBarTone = 'brand' | 'success' | 'warning' | 'danger';

export type ProgressBarProps = {
  /**
   * current value represented by the bar.
   */
  value?: number;

  /**
   * maximum value the bar can reach.
   */
  max?: number;

  /**
   * label rendered above the bar, describing what is being measured.
   */
  label?: string;

  /**
   * color tone of the bar. Escalates automatically to `warning` or `danger`
   * as the value approaches the max, unless the tone is `success`.
   */
  tone?: ProgressBarTone;

  /**
   * renders the current value alongside the max, for example `18 / 30`.
   */
  showValue?: boolean;

  /**
   * class name for the progress bar root element.
   */
  className?: string;

  /**
   * inline style for the progress bar root element.
   */
  style?: React.CSSProperties;
};

const TONE_TO_CLASS: Record<ProgressBarTone, string> = {
  brand: styles.brand,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
};

function resolveTone(tone: ProgressBarTone, ratio: number): ProgressBarTone {
  if (tone === 'success') return 'success';
  if (ratio >= 0.9) return 'danger';
  if (ratio >= 0.75) return 'warning';
  return tone;
}

/**
 * Horizontal progress/quota bar used for the AI reply quota meter and digest goals.
 * Automatically escalates its tone as the value approaches the max.
 */
export function ProgressBar({
  value = 18,
  max = 30,
  label,
  tone = 'brand',
  showValue = false,
  className,
  style,
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;
  const ratio = Math.min(1, Math.max(0, value / safeMax));
  const percentage = ratio * 100;
  const effectiveTone = resolveTone(tone, ratio);

  return (
    <div className={classNames(styles.progressBar, className)} style={style}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && (
            <span className={styles.value}>
              {value} / {max}
            </span>
          )}
        </div>
      )}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={classNames(styles.fill, TONE_TO_CLASS[effectiveTone])}
          style={{ '--progress-bar-fill': `${percentage}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
