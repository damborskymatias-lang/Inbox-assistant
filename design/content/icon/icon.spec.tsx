import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Icon } from './icon.js';
import styles from './icon.module.scss';

function DotPath() {
  return <circle cx="12" cy="12" r="4" />;
}

it('should render the svg icon with default size', () => {
  const { container } = render(
    <MemoryRouter>
      <Icon>
        <DotPath />
      </Icon>
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg).toBeTruthy();
  expect(svg?.classList.contains(styles.icon)).toBe(true);
});

it('should render a title element when title prop is provided', () => {
  const { container } = render(
    <MemoryRouter>
      <Icon title="Notification">
        <DotPath />
      </Icon>
    </MemoryRouter>
  );
  const title = container.querySelector('title');
  expect(title?.textContent).toBe('Notification');
});

it('should mark the svg as presentation when no title is provided', () => {
  const { container } = render(
    <MemoryRouter>
      <Icon>
        <DotPath />
      </Icon>
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg?.getAttribute('role')).toBe('presentation');
  expect(svg?.getAttribute('aria-hidden')).toBe('true');
});

it('should apply a custom class name in addition to the icon class', () => {
  const { container } = render(
    <MemoryRouter>
      <Icon className="custom-icon">
        <DotPath />
      </Icon>
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg?.classList.contains('custom-icon')).toBe(true);
});

it('should render the provided children paths', () => {
  const { container } = render(
    <MemoryRouter>
      <Icon>
        <DotPath />
      </Icon>
    </MemoryRouter>
  );
  const circle = container.querySelector('circle');
  expect(circle).toBeTruthy();
});
