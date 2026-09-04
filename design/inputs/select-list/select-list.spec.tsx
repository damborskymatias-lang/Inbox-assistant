import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SelectList } from './select-list.js';
import styles from './select-list.module.scss';

const options = [
  { value: `urgent`, label: `Urgent` },
  { value: `fyi`, label: `FYI` },
];

describe('SelectList', () => {
  it('renders the label and placeholder when no value is selected', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <SelectList label="Filter" options={options} placeholder="Choose one" />
      </MemoryRouter>
    );

    const label = container.querySelector(`.${styles.label}`);
    const trigger = container.querySelector(`.${styles.trigger}`);

    expect(label?.textContent).toBe(`Filter`);
    expect(trigger?.textContent).toContain(`Choose one`);
  });

  it('renders the selected option label instead of the placeholder', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <SelectList options={options} value="fyi" placeholder="Choose one" />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.trigger}`);

    expect(trigger?.textContent).toContain(`FYI`);
    expect(trigger?.textContent).not.toContain(`Choose one`);
  });

  it('opens the menu and lists all options when the trigger is clicked', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <SelectList options={options} placeholder="Choose one" />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.trigger}`) as HTMLButtonElement;
    fireEvent.click(trigger);

    const renderedOptions = container.querySelectorAll(`.${styles.option}`);

    expect(renderedOptions.length).toBe(options.length);
  });

  it('calls onChange with the selected value and closes the menu', () => {
    const handleChange = vi.fn();

    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <SelectList options={options} onChange={(value) => handleChange(value)} />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.trigger}`) as HTMLButtonElement;
    fireEvent.click(trigger);

    const renderedOptions = container.querySelectorAll(`.${styles.option}`);
    fireEvent.click(renderedOptions[1]);

    expect(handleChange).toHaveBeenCalledWith(`fyi`);

    const menuAfterSelect = container.querySelectorAll(`.${styles.option}`);
    expect(menuAfterSelect.length).toBe(0);
  });
});
