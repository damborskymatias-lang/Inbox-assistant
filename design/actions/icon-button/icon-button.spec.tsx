import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IconButton } from './icon-button.js';
import styles from './icon-button.module.scss';

describe(`IconButton`, () => {
  it(`renders the icon and accessible label`, () => {
    const { container } = render(
      <MemoryRouter>
        <IconButton icon="🗂" label="Archive email" />
      </MemoryRouter>
    );

    const button = container.querySelector(`button`);
    expect(button?.getAttribute(`aria-label`)).toBe(`Archive email`);
    expect(button?.textContent).toBe(`🗂`);
  });

  it(`calls onClick when clicked`, () => {
    let clicked = false;
    const { container } = render(
      <MemoryRouter>
        <IconButton icon="🗑" label="Delete email" onClick={() => { clicked = true; }} />
      </MemoryRouter>
    );

    const button = container.querySelector(`button`);
    fireEvent.click(button as Element);

    expect(clicked).toBe(true);
  });

  it(`does not call onClick when disabled`, () => {
    let clicked = false;
    const { container } = render(
      <MemoryRouter>
        <IconButton icon="🗑" label="Delete email" disabled onClick={() => { clicked = true; }} />
      </MemoryRouter>
    );

    const button = container.querySelector(`button`);
    fireEvent.click(button as Element);

    expect(clicked).toBe(false);
  });

  it(`applies the active class when active is true`, () => {
    const { container } = render(
      <MemoryRouter>
        <IconButton icon="⋯" label="More actions" active />
      </MemoryRouter>
    );

    const button = container.querySelector(`button`);
    expect(button?.className).toContain(styles.active);
  });

  it(`applies the danger variant class`, () => {
    const { container } = render(
      <MemoryRouter>
        <IconButton icon="🗑" label="Delete email" variant="danger" />
      </MemoryRouter>
    );

    const button = container.querySelector(`button`);
    expect(button?.className).toContain(styles.danger);
  });
});
