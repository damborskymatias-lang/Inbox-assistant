import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { Toggle } from './toggle.js';
import styles from './toggle.module.scss';

it('should render the label and description', () => {
  const { container } = render(
    <MockProvider>
      <Toggle label="Daily digest" description="Receive a summary every morning." />
    </MockProvider>
  );
  const label = container.querySelector(`.${styles.label}`);
  const description = container.querySelector(`.${styles.description}`);
  expect(label?.textContent).toBe('Daily digest');
  expect(description?.textContent).toBe('Receive a summary every morning.');
});

it('should reflect the checked state on the switch', () => {
  const { container } = render(
    <MockProvider>
      <Toggle checked label="Daily digest" />
    </MockProvider>
  );
  const switchEl = container.querySelector(`.${styles.switch}`);
  expect(switchEl?.getAttribute('aria-checked')).toBe('true');
  expect(switchEl?.className).toContain(styles.checked);
});

it('should call onChange with the toggled value when clicked', () => {
  let value: boolean | undefined;
  const handleChange = (next: boolean) => {
    value = next;
  };

  const { container } = render(
    <MockProvider>
      <Toggle checked={false} onChange={handleChange} label="Daily digest" />
    </MockProvider>
  );

  const switchEl = container.querySelector(`.${styles.switch}`) as HTMLButtonElement;
  fireEvent.click(switchEl);

  expect(value).toBe(true);
});

it('should not call onChange when disabled', () => {
  let called = false;
  const handleChange = () => {
    called = true;
  };

  const { container } = render(
    <MockProvider>
      <Toggle checked={false} disabled onChange={handleChange} label="Daily digest" />
    </MockProvider>
  );

  const switchEl = container.querySelector(`.${styles.switch}`) as HTMLButtonElement;
  fireEvent.click(switchEl);

  expect(called).toBe(false);
});

it('should apply the size class name', () => {
  const { container } = render(
    <MockProvider>
      <Toggle size="lg" label="Daily digest" />
    </MockProvider>
  );
  const switchEl = container.querySelector(`.${styles.switch}`);
  expect(switchEl?.className).toContain(styles.lg);
});

it('should apply a custom class name', () => {
  const { container } = render(
    <MockProvider>
      <Toggle className="custom-class" label="Daily digest" />
    </MockProvider>
  );
  const toggle = container.querySelector('.custom-class');
  expect(toggle).toBeTruthy();
});
