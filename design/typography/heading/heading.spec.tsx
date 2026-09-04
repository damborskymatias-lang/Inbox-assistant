import React from 'react';
import { render } from '@testing-library/react';
import { Heading } from './heading.js';
import styles from './heading.module.scss';

it('renders the correct heading element for a given level', () => {
  const { container } = render(<Heading level={3}>Section title</Heading>);
  const heading = container.querySelector('h3');
  expect(heading).toBeTruthy();
  expect(heading?.textContent).toBe('Section title');
});

it('defaults to an h1 element when no level is provided', () => {
  const { container } = render(<Heading>Main title</Heading>);
  const heading = container.querySelector('h1');
  expect(heading).toBeTruthy();
});

it('applies the size class matching the level when no size override is passed', () => {
  const { container } = render(<Heading level={1}>Title</Heading>);
  const heading = container.querySelector('h1');
  expect(heading?.className).toContain(styles.xl);
});

it('applies the size override class instead of the level default', () => {
  const { container } = render(
    <Heading level={1} size="sm">
      Title
    </Heading>
  );
  const heading = container.querySelector('h1');
  expect(heading?.className).toContain(styles.sm);
  expect(heading?.className).not.toContain(styles.xl);
});

it('applies the weight class matching the weight prop', () => {
  const { container } = render(
    <Heading level={2} weight="medium">
      Title
    </Heading>
  );
  const heading = container.querySelector('h2');
  expect(heading?.className).toContain(styles.weightMedium);
});

it('applies a custom class name passed via props', () => {
  const { container } = render(<Heading className="custom-heading">Title</Heading>);
  const heading = container.querySelector('h1');
  expect(heading?.className).toContain('custom-heading');
});
