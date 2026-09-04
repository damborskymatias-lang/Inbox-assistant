import React from 'react';
import classNames from 'classnames';
import { Paragraph } from '@lov/design.typography.paragraph';
import styles from './toggle.module.scss';

export type ToggleSize = 'sm' | 'md' | 'lg';

export type ToggleProps = {
  /**
   * whether the toggle is currently on.
   */
  checked?: boolean;

  /**
   * called when the toggle state changes.
   */
  onChange?: (checked: boolean) => void;

  /**
   * label rendered next to the switch.
   */
  label?: string;

  /**
   * secondary descriptive text rendered below the label.
   */
  description?: string;

  /**
   * disables interaction with the toggle.
   */
  disabled?: boolean;

  /**
   * controls the size of the switch.
   */
  size?: ToggleSize;

  /**
   * class name for the toggle root element.
   */
  className?: string;

  /**
   * inline style for the toggle root element.
   */
  style?: React.CSSProperties;
};

const SIZE_TO_CLASS: Record<ToggleSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

/**
 * A switch/toggle control with an optional label and description, used to manage
 * digest notification preferences and assistant settings.
 */
export function Toggle({
  checked = false,
  onChange,
  label = `Daily digest`,
  description = `Receive a summary of your most important emails every morning.`,
  disabled = false,
  size = 'md',
  className,
  style,
}: ToggleProps) {
  const handleClick = () => {
    if (disabled) return;
    onChange?.(!checked);
  };

  return (
    <div
      className={classNames(
        styles.toggleRow,
        disabled ? styles.disabled : undefined,
        className
      )}
      style={style}
    >
      {(label || description) && (
        <div className={styles.textGroup}>
          {label && (
            <span className={styles.label} onClick={() => handleClick()}>
              {label}
            </span>
          )}
          {description && (
            <Paragraph size="sm" tone="soft" className={styles.description}>
              {description}
            </Paragraph>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => handleClick()}
        className={classNames(styles.switch, SIZE_TO_CLASS[size], checked ? styles.checked : undefined)}
      >
        <span className={styles.thumb} />
      </button>
    </div>
  );
}
