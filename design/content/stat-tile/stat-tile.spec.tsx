import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StatTile } from './stat-tile.js';
import styles from './stat-tile.module.scss';

it('should render the count and label', () => {
  const { container } = render(
    <MemoryRouter>
      <StatTile count={3} label="Urgent" />
    </MemoryRouter>
  );
  const count = container.querySelector(`.${styles.count}`);
  const label = container.querySelector(`.${styles.labelText}`);
  expect(count?.textContent).toBe('3');
  expect(label?.textContent).toBe('Urgent');
});

it('should render the provided emoji', () => {
  const { container } = render(
    <MemoryRouter>
      <StatTile count={3} label="Urgent" emoji="🔥" />
    </MemoryRouter>
  );
  const icon = container.querySelector(`.${styles.icon}`);
  expect(icon?.textContent).toBe('🔥');
});

it('should apply the selected class name when selected is true', () => {
  const { container } = render(
    <MemoryRouter>
      <StatTile count={3} label="Urgent" selected />
    </MemoryRouter>
  );
  const tile = container.querySelector(`.${styles.tile}`);
  expect(tile?.className).toContain(styles.tileSelected);
});

it('should not apply the selected class name when selected is false', () => {
  const { container } = render(
    <MemoryRouter>
      <StatTile count={3} label="Urgent" />
    </MemoryRouter>
  );
  const tile = container.querySelector(`.${styles.tile}`);
  expect(tile?.className).not.toContain(styles.tileSelected);
});

it('should call onSelect when clicked', () => {
  const handleSelect = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <StatTile count={3} label="Urgent" onSelect={handleSelect} />
    </MemoryRouter>
  );
  const tile = container.querySelector(`.${styles.tile}`) as HTMLButtonElement;
  fireEvent.click(tile);
  expect(handleSelect).toHaveBeenCalledTimes(1);
});

it('should apply a custom class name', () => {
  const { container } = render(
    <MemoryRouter>
      <StatTile count={3} label="Urgent" className="custom-class" />
    </MemoryRouter>
  );
  const tile = container.querySelector('.custom-class');
  expect(tile).toBeTruthy();
});
