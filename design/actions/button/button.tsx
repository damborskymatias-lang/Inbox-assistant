import React from 'react';
import classNames from 'classnames';
import { Link } from '@lov/design.navigation.link';
import styles from './button.module.scss';

export type ButtonProps = {
  /**
   * the visual style of the button.
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';

  /**
   * the size of the button.
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * shows an inline spinner and disables the button when true.
   */
  loading?: boolean;

  /**
   * disables the button, preventing interaction.
   */
  disabled?: boolean;

  /**
   * stretches the button to fill the width of its container.
   */
  fullWidth?: boolean;

  /**
   * an icon rendered before the label.
   */
  iconStart?: React.ReactNode;

  /**
   * an icon rendered after the label.
   */
  iconEnd?: React.ReactNode;

  /**
   * renders the button as a link pointing to this destination.
   */
  href?: string;

  /**
   * marks the destination as external, when rendered as a link.
   */
  external?: boolean;

  /**
   * the native button type, used when not rendered as a link.
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * called when the button is clicked.
   */
  onClick?: () => void;

  /**
   * the label content of the button.
   */
  children?: React.ReactNode;

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
 * a button matching the inbox assistant prototype, with solid, outlined, ghost and danger
 * variants, loading and disabled states, and an optional link behavior.
 */
export function Button({
  variant = `primary`,
  size = `md`,
  loading = false,
  disabled = false,
  fullWidth = false,
  iconStart,
  iconEnd,
  href,
  external = false,
  type = `button`,
  onClick,
  children,
  className,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonClassName = classNames(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    className
  );

  const content = (
    <span className={styles.content}>
      {loading && <span className={styles.spinner} />}
      {!loading && iconStart && <span className={styles.icon}>{iconStart}</span>}
      {children && <span className={styles.label}>{children}</span>}
      {!loading && iconEnd && <span className={styles.icon}>{iconEnd}</span>}
    </span>
  );

  if (href && !isDisabled) {
    return (
      <Link href={href} external={external} className={buttonClassName} style={style}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClassName}
      style={style}
      disabled={isDisabled}
      onClick={() => onClick?.()}
    >
      {content}
    </button>
  );
}
