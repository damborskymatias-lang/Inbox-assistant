import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Button } from '@lov/design.actions.button';
import { Heading } from '@lov/design.typography.heading';
import { Paragraph } from '@lov/design.typography.paragraph';
import styles from './confirm-dialog.module.scss';

export type ConfirmDialogTone = 'default' | 'danger';

export type ConfirmDialogProps = {
  /**
   * controls whether the dialog is rendered and visible.
   */
  open: boolean;

  /**
   * the dialog title, describing the action being confirmed.
   */
  title?: string;

  /**
   * additional context describing the consequences of the action.
   */
  description?: string;

  /**
   * label rendered on the confirm button.
   */
  confirmLabel?: string;

  /**
   * label rendered on the cancel button.
   */
  cancelLabel?: string;

  /**
   * visual tone of the dialog, used to signal destructive actions.
   */
  tone?: ConfirmDialogTone;

  /**
   * shows a loading state on the confirm button and blocks dismissal.
   */
  loading?: boolean;

  /**
   * called when the confirm action is triggered.
   */
  onConfirm?: () => void;

  /**
   * called when the dialog is dismissed via cancel, backdrop click or escape.
   */
  onCancel?: () => void;

  /**
   * class name to override the dialog panel styles.
   */
  className?: string;

  /**
   * style property for the dialog panel.
   */
  style?: React.CSSProperties;
};

/**
 * a modal confirmation dialog with a backdrop, used as the single explicit
 * confirmation gate for one-click cleanup actions like archiving newsletters.
 */
export function ConfirmDialog({
  open,
  title = `Are you sure?`,
  description = `42 newsletters detected from the last 30 days. Archive all?`,
  confirmLabel = `Archive all`,
  cancelLabel = `Cancel`,
  tone = `default`,
  loading = false,
  onConfirm,
  onCancel,
  className,
  style,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onCancel?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, loading, onCancel]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onClick={() => {
        if (!loading) {
          onCancel?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={classNames(styles.dialog, className)}
        style={style}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={classNames(
            styles.iconBadge,
            tone === 'danger' ? styles.iconDanger : styles.iconDefault
          )}
        >
          <span>{tone === 'danger' ? '⚠️' : '🧹'}</span>
        </div>
        <Heading level={3} className={styles.title}>
          {title}
        </Heading>
        <Paragraph size="md" tone="soft" className={styles.description}>
          {description}
        </Paragraph>
        <div className={styles.actions}>
          <Button variant="ghost" disabled={loading} onClick={() => onCancel?.()}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            loading={loading}
            onClick={() => onConfirm?.()}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
