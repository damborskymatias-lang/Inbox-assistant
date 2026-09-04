import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Link } from './link.js';
import styles from './link.module.scss';

it('should render children text', () => {
  const { container } = render(
    <MemoryRouter>
      <Link href="/dashboard">Dashboard</Link>
    </MemoryRouter>
  );

  const rendered = container.querySelector('a');
  expect(rendered).toBeTruthy();
  expect(rendered?.textContent).toBe('Dashboard');
});

it('should render an internal link with the href pointing to the route', () => {
  const { container } = render(
    <MemoryRouter>
      <Link href="/inbox">Inbox</Link>
    </MemoryRouter>
  );

  const rendered = container.querySelector('a');
  expect(rendered?.getAttribute('href')).toBe('/inbox');
});

it('should render an external link with rel noopener and target blank', () => {
  const { container } = render(
    <MemoryRouter>
      <Link href="https://bit.dev" external>
        Bit.dev
      </Link>
    </MemoryRouter>
  );

  const rendered = container.querySelector('a');
  expect(rendered?.getAttribute('rel')).toContain('noopener');
  expect(rendered?.getAttribute('target')).toBe('_blank');
  expect(rendered?.getAttribute('href')).toContain('bit.dev');
});

it('should apply the active class name when active is set', () => {
  const { container } = render(
    <MemoryRouter>
      <Link href="/dashboard" active>
        Dashboard
      </Link>
    </MemoryRouter>
  );

  const rendered = container.querySelector('a');
  expect(rendered?.className).toContain(styles.active);
});

it('should apply the underline class name when underline is set', () => {
  const { container } = render(
    <MemoryRouter>
      <Link href="/dashboard" underline>
        Dashboard
      </Link>
    </MemoryRouter>
  );

  const rendered = container.querySelector('a');
  expect(rendered?.className).toContain(styles.underline);
});

it('should apply a custom class name', () => {
  const { container } = render(
    <MemoryRouter>
      <Link href="/dashboard" className="custom-link">
        Dashboard
      </Link>
    </MemoryRouter>
  );

  const rendered = container.querySelector('a');
  expect(rendered?.className).toContain('custom-link');
});

it('should not throw when clicked', () => {
  const { container } = render(
    <MemoryRouter>
      <Link href="/dashboard">Dashboard</Link>
    </MemoryRouter>
  );

  const rendered = container.querySelector('a') as HTMLAnchorElement;
  fireEvent.click(rendered);
  expect(rendered).toBeTruthy();
});
