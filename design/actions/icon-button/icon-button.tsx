import React from 'react';
import classNames from 'classnames';
import styles from './icon-button.module.scss';

export type IconButtonProps = {
  /**
   * the icon content rendered inside the button (emoji or an svg element).
   */
  icon: React.ReactNode;

  /**
   * accessible label, used for the aria-label and title attributes.
   */
  label: string;

  /**
   * the size of the button.
   */
  size?: `sm` | `md`;

  /**
   * the visual style of the button.
   */
  variant?: `ghost` | `secondary` | `danger`;

  /**
   * marks the button as active/pressed, for example when a related panel is open.
   */
  active?: boolean;

  /**
   * disables the button, preventing interaction.
   */
  disabled?: boolean;

  /**
   * called when the button is clicked.
   */
  onClick?: () => void;

  /**
   * a class name to override the button styles.
   */
  className?: string;

  /**
   * style for layout and positioning purposes.
   */
  style?: React.CSSProperties;
};

/**
 * a compact, square, icon-only button used for row-level actions like archive,
 * delete and overflow menus.
 */
export function IconButton({
  icon,
  label,
  size = `md`,
  variant = `ghost`,
  active = false,
  disabled = false,
  onClick,
  className,
  style,
}: IconButtonProps) {
  const buttonClassName = classNames(
    styles.iconButton,
    styles[size],
    styles[variant],
    active && styles.active,
    disabled && styles.disabled,
    className
  );

  return (
    <button
      type="button"
      className={buttonClassName}
      style={style}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={() => onClick?.()}
    >
      <span className={styles.icon}>{icon}</span>
    </button>
  );
}
