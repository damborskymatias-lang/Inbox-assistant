import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './dropdown.module.scss';

export type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export type DropdownProps = {
  /**
   * the element that triggers the dropdown when clicked.
   */
  trigger: React.ReactNode;

  /**
   * the content rendered inside the dropdown panel.
   */
  children?: React.ReactNode;

  /**
   * placement of the dropdown panel relative to the trigger.
   */
  placement?: DropdownPlacement;

  /**
   * controlled open state.
   */
  open?: boolean;

  /**
   * default open state for uncontrolled usage.
   */
  defaultOpen?: boolean;

  /**
   * callback fired when the open state should change.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * class name for the root container.
   */
  className?: string;

  /**
   * class name for the trigger wrapper.
   */
  triggerClassName?: string;

  /**
   * class name for the dropdown panel.
   */
  contentClassName?: string;

  /**
   * inline style for the root container.
   */
  style?: React.CSSProperties;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Dropdown({
  trigger,
  children,
  placement = 'bottom-start',
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  triggerClassName,
  contentClassName,
  style,
}: DropdownProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const handleTriggerClick = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen, setOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.querySelector('button, a')?.dispatchEvent(new Event('focus'));
        return;
      }

      if (event.key !== 'Tab' || !contentRef.current) {
        return;
      }

      const focusable = Array.from(
        contentRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setOpen]);

  useEffect(() => {
    if (!isOpen || !contentRef.current) {
      return;
    }

    const focusable = contentRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    focusable?.focus();
  }, [isOpen]);

  const placementClass = {
    'bottom-start': styles.bottomStart,
    'bottom-end': styles.bottomEnd,
    'top-start': styles.topStart,
    'top-end': styles.topEnd,
  }[placement];

  return (
    <div ref={rootRef} className={classNames(styles.dropdown, className)} style={style}>
      <div
        ref={triggerRef}
        className={classNames(styles.trigger, triggerClassName)}
        onClick={() => handleTriggerClick()}
      >
        {trigger}
      </div>
      {isOpen ? (
        <div
          ref={contentRef}
          role="menu"
          className={classNames(styles.content, placementClass, contentClassName)}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
