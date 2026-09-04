import React, { useEffect, useId, useState } from 'react';
import classNames from 'classnames';
import { Icon } from '@lov/design.content.icon';
import { Paragraph } from '@lov/design.typography.paragraph';
import styles from './text-input.module.scss';

export type TextInputType = 'text' | 'search' | 'email' | 'password' | 'number' | 'tel' | 'url';

export type TextInputProps = {
  /**
   * the input's id attribute. auto-generated when not provided.
   */
  id?: string;

  /**
   * the input's name attribute.
   */
  name?: string;

  /**
   * the current value of the input, for controlled usage.
   */
  value?: string;

  /**
   * the initial value of the input, for uncontrolled usage.
   */
  defaultValue?: string;

  /**
   * placeholder text shown when the input is empty.
   */
  placeholder?: string;

  /**
   * label rendered above the input.
   */
  label?: string;

  /**
   * error message. when set, the input renders in an error state.
   */
  error?: string;

  /**
   * helper text rendered below the input, hidden when an error is present.
   */
  helperText?: string;

  /**
   * icon rendered at the start of the input, before the text.
   */
  iconStart?: React.ReactNode;

  /**
   * renders a clear button that empties the input when it has a value.
   */
  clearable?: boolean;

  /**
   * the type of the input.
   */
  type?: TextInputType;

  /**
   * disables the input.
   */
  disabled?: boolean;

  /**
   * marks the input as required.
   */
  required?: boolean;

  /**
   * the autocomplete attribute of the input.
   */
  autoComplete?: string;

  /**
   * the maximum number of characters allowed.
   */
  maxLength?: number;

  /**
   * called with the new value whenever the input changes.
   */
  onChange?: (value: string) => void;

  /**
   * called when the clear button is pressed.
   */
  onClear?: () => void;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * inline style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * A text input with label, placeholder, helper text, error state, optional leading icon and a clearable variant.
 */
export function TextInput({
  id,
  name,
  value,
  defaultValue = ``,
  placeholder,
  label,
  error,
  helperText,
  iconStart,
  clearable = false,
  type = `text`,
  disabled = false,
  required = false,
  autoComplete,
  maxLength,
  onChange,
  onClear,
  className,
  style,
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const currentValue = isControlled ? value : innerValue;

  useEffect(() => {
    if (isControlled) {
      setInnerValue(value);
    }
  }, [isControlled, value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    if (!isControlled) {
      setInnerValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInnerValue(``);
    }
    onChange?.(``);
    onClear?.();
  };

  const showClearButton = clearable && Boolean(currentValue) && !disabled;

  return (
    <div className={classNames(styles.field, className)} style={style}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div
        className={classNames(
          styles.inputWrapper,
          error ? styles.hasError : undefined,
          disabled ? styles.disabled : undefined
        )}
      >
        {iconStart && <span className={styles.iconStart}>{iconStart}</span>}
        <input
          id={inputId}
          name={name}
          type={type}
          value={currentValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className={classNames(
            styles.input,
            iconStart ? styles.withIconStart : undefined,
            showClearButton ? styles.withClearButton : undefined
          )}
          aria-invalid={Boolean(error)}
          onChange={(event) => handleChange(event)}
        />
        {showClearButton && (
          <button
            type="button"
            className={styles.clearButton}
            aria-label="Clear input"
            onClick={() => handleClear()}
          >
            <Icon size="sm" color="muted">
              <path d="M18 6 6 18M6 6l12 12" />
            </Icon>
          </button>
        )}
      </div>
      {(error || helperText) && (
        <Paragraph
          size="sm"
          tone={error ? `danger` : `muted`}
          className={styles.helperText}
        >
          {error || helperText}
        </Paragraph>
      )}
    </div>
  );
}
