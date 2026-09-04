import React, { useId, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Paragraph } from '@lov/design.typography.paragraph';
import styles from './textarea.module.scss';

export type TextareaProps = {
  /**
   * label rendered above the textarea.
   */
  label?: string;

  /**
   * controlled value of the textarea.
   */
  value?: string;

  /**
   * initial value when the textarea is uncontrolled.
   */
  defaultValue?: string;

  /**
   * placeholder text shown when the textarea is empty.
   */
  placeholder?: string;

  /**
   * error message shown below the textarea. Also toggles the error visual state.
   */
  error?: string;

  /**
   * helper text shown below the textarea when there is no error.
   */
  helperText?: string;

  /**
   * maximum number of characters allowed.
   */
  maxLength?: number;

  /**
   * shows a live character count below the textarea.
   */
  showCount?: boolean;

  /**
   * grows the textarea height automatically to fit its content.
   */
  autoGrow?: boolean;

  /**
   * minimum number of visible text rows.
   */
  minRows?: number;

  /**
   * maximum number of rows the textarea can grow to when autoGrow is enabled.
   */
  maxRows?: number;

  /**
   * disables the textarea.
   */
  disabled?: boolean;

  /**
   * marks the field as required.
   */
  required?: boolean;

  /**
   * name attribute of the textarea, used for form submission.
   */
  name?: string;

  /**
   * id of the textarea element. When omitted, an id is generated automatically.
   */
  id?: string;

  /**
   * called with the next value whenever the textarea content changes.
   */
  onChange?: (value: string) => void;

  /**
   * called when the textarea receives focus.
   */
  onFocus?: () => void;

  /**
   * called when the textarea loses focus.
   */
  onBlur?: () => void;

  /**
   * a class name to override the container styles.
   */
  className?: string;

  /**
   * inline style for the container element.
   */
  style?: React.CSSProperties;
};

const DEFAULT_PLACEHOLDER = `Write your reply...`;
const LINE_HEIGHT_PX = 22;

/**
 * a multiline textarea used for editing long-form content, such as AI-generated reply drafts.
 */
export function Textarea({
  label,
  value,
  defaultValue = '',
  placeholder = DEFAULT_PLACEHOLDER,
  error,
  helperText,
  maxLength,
  showCount = false,
  autoGrow = false,
  minRows = 3,
  maxRows,
  disabled = false,
  required = false,
  name,
  id,
  onChange,
  onFocus,
  onBlur,
  className,
  style,
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  useLayoutEffect(() => {
    if (!autoGrow) return;
    const node = textareaRef.current;
    if (!node) return;
    node.style.height = 'auto';
    const nextHeight = maxRows
      ? Math.min(node.scrollHeight, maxRows * LINE_HEIGHT_PX)
      : node.scrollHeight;
    node.style.height = `${nextHeight}px`;
  }, [currentValue, autoGrow, maxRows]);

  const handleChange = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const characterCount = currentValue.length;
  const isOverLimit = Boolean(maxLength) && characterCount > (maxLength as number);

  return (
    <div className={classNames(styles.field, className)} style={style}>
      {label && (
        <label className={styles.label} htmlFor={textareaId}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <textarea
        ref={textareaRef}
        id={textareaId}
        name={name}
        className={classNames(
          styles.textarea,
          error && styles.textareaError,
          autoGrow && styles.autoGrow
        )}
        placeholder={placeholder}
        value={currentValue}
        onChange={(event) => handleChange(event.target.value)}
        onFocus={() => onFocus?.()}
        onBlur={() => onBlur?.()}
        disabled={disabled}
        required={required}
        rows={minRows}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
      />
      <div className={styles.footer}>
        <div className={styles.message}>
          {error && (
            <Paragraph size="sm" tone="danger" weight="medium" className={styles.messageText}>
              {error}
            </Paragraph>
          )}
          {!error && helperText && (
            <Paragraph size="sm" tone="muted" className={styles.messageText}>
              {helperText}
            </Paragraph>
          )}
        </div>
        {showCount && (
          <Paragraph size="sm" tone={isOverLimit ? 'danger' : 'muted'} className={styles.count}>
            {maxLength ? `${characterCount}/${maxLength}` : `${characterCount}`}
          </Paragraph>
        )}
      </div>
    </div>
  );
}
