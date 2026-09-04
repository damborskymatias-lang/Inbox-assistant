import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProgressBar } from './progress-bar.js';
import styles from './progress-bar.module.scss';

it('should render the label and value', () => {
  const { container } = render(
    <MemoryRouter>
      <ProgressBar label="AI replies used" value={18} max={30} showValue />
    </MemoryRouter>
  );
  const label = container.querySelector(`.${styles.label}`);
  const value = container.querySelector(`.${styles.value}`);
  expect(label?.textContent).toBe('AI replies used');
  expect(value?.textContent).toBe('18 / 30');
});

it('should not render the value when showValue is false', () => {
  const { container } = render(
    <MemoryRouter>
      <ProgressBar label="AI replies used" value={18} max={30} />
    </MemoryRouter>
  );
  const value = container.querySelector(`.${styles.value}`);
  expect(value).toBeNull();
});

it('should apply the brand tone by default when far from the max', () => {
  const { container } = render(
    <MemoryRouter>
      <ProgressBar value={5} max={30} />
    </MemoryRouter>
  );
  const fill = container.querySelector(`.${styles.fill}`);
  expect(fill?.className).toContain(styles.brand);
});

it('should escalate to warning tone when approaching the max', () => {
  const { container } = render(
    <MemoryRouter>
      <ProgressBar value={23} max={30} />
    </MemoryRouter>
  );
  const fill = container.querySelector(`.${styles.fill}`);
  expect(fill?.className).toContain(styles.warning);
});

it('should escalate to danger tone when very close to the max', () => {
  const { container } = render(
    <MemoryRouter>
      <ProgressBar value={28} max={30} />
    </MemoryRouter>
  );
  const fill = container.querySelector(`.${styles.fill}`);
  expect(fill?.className).toContain(styles.danger);
});

it('should keep the success tone even when close to the max', () => {
  const { container } = render(
    <MemoryRouter>
      <ProgressBar value={28} max={30} tone="success" />
    </MemoryRouter>
  );
  const fill = container.querySelector(`.${styles.fill}`);
  expect(fill?.className).toContain(styles.success);
});

it('should apply a custom class name', () => {
  const { container } = render(
    <MemoryRouter>
      <ProgressBar className="custom-class" />
    </MemoryRouter>
  );
  const root = container.querySelector('.custom-class');
  expect(root).toBeTruthy();
});
