import React from 'react';
import classNames from 'classnames';
import { Dropdown } from '@lov/design.overlays.dropdown';
import { ChevronDownIcon } from './chevron-down-icon.js';
import type { SelectOption } from './select-option-type.js';
import { writingStyleOptions } from './select-list.mock.js';
import styles from './select-list.module.scss';

export type SelectListProps = {
  /**
   * the list of selectable options rendered in the dropdown.
   */
  options?: SelectOption[];

  /**
   * the value of the currently selected option.
   */
  value?: string;

  /**
   * called when the user selects an option, receiving the selected value.
   */
  onChange?: (value: string) => void;

  /**
   * placeholder text shown when no option is selected.
   */
  placeholder?: string;

  /**
   * label displayed above the select control.
   */
  label?: string;

  /**
   * class name for the root container.
   */
  className?: string;

  /**
   * style for the root container.
   */
  style?: React.CSSProperties;
};

/**
 * Select control rendering a list of options in a dropdown, used for writing-style
 * selection, filters and cleanup rule pickers.
 */
export function SelectList({
  options = writingStyleOptions,
  value,
  onChange,
  placeholder = `Select an option`,
  label,
  className,
  style,
}: SelectListProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (nextValue: string) => {
    onChange?.(nextValue);
    setOpen(false);
  };

  return (
    <div className={classNames(styles.selectList, className)} style={style}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <Dropdown
        placement="bottom-start"
        open={open}
        onOpenChange={(nextOpen) => setOpen(nextOpen)}
        trigger={
          <button
            type="button"
            className={classNames(styles.trigger, open ? styles.triggerOpen : undefined)}
          >
            <span className={styles.triggerContent}>
              {selectedOption?.icon ? (
                <span className={styles.optionIcon}>{selectedOption.icon}</span>
              ) : null}
              <span
                className={classNames(
                  styles.triggerLabel,
                  !selectedOption ? styles.placeholder : undefined
                )}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </span>
            <ChevronDownIcon open={open} />
          </button>
        }
      >
        <div className={styles.menu} role="listbox">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={classNames(
                styles.option,
                option.value === value ? styles.optionSelected : undefined
              )}
              onClick={() => handleSelect(option.value)}
            >
              {option.icon ? <span className={styles.optionIcon}>{option.icon}</span> : null}
              <span className={styles.optionLabel}>{option.label}</span>
            </button>
          ))}
        </div>
      </Dropdown>
    </div>
  );
}
