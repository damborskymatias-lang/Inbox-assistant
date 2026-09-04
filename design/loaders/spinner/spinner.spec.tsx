import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Spinner, DraftingIndicator } from './spinner.js';
import styles from './spinner.module.scss';

it('renders the spinner with the default medium size', () => {
  const { container } = render(
    <MemoryRouter>
      <Spinner />
    </MemoryRouter>
  );

  const spinner = container.querySelector(`.${styles.spinner}`);
  expect(spinner).toBeTruthy();
  expect(spinner?.className).toContain(styles.md);
});

it('renders the spinner with the requested size', () => {
  const { container } = render(
    <MemoryRouter>
      <Spinner size="lg" />
    </MemoryRouter>
  );

  const spinner = container.querySelector(`.${styles.spinner}`);
  expect(spinner?.className).toContain(styles.lg);
});

it('renders the label when provided', () => {
  const { getByText } = render(
    <MemoryRouter>
      <Spinner label="Loading data…" />
    </MemoryRouter>
  );

  expect(getByText('Loading data…')).toBeTruthy();
});

it('does not render a label element when no label is provided', () => {
  const { container } = render(
    <MemoryRouter>
      <Spinner />
    </MemoryRouter>
  );

  const label = container.querySelector(`.${styles.label}`);
  expect(label).toBeNull();
});

it('renders the drafting indicator with the default label', () => {
  const { getByText } = render(
    <MemoryRouter>
      <DraftingIndicator />
    </MemoryRouter>
  );

  expect(getByText(`Drafting a reply in your writing style…`)).toBeTruthy();
});

it('renders three pulsing dots for the drafting indicator', () => {
  const { container } = render(
    <MemoryRouter>
      <DraftingIndicator />
    </MemoryRouter>
  );

  const dots = container.querySelectorAll(`.${styles.dot}`);
  expect(dots.length).toBe(3);
});

it('renders a custom label for the drafting indicator', () => {
  const { getByText } = render(
    <MemoryRouter>
      <DraftingIndicator label="Summarizing your inbox…" />
    </MemoryRouter>
  );

  expect(getByText('Summarizing your inbox…')).toBeTruthy();
});
