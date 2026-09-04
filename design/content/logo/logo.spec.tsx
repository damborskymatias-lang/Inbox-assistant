import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Logo } from './logo.js';
import styles from './logo.module.scss';

describe(`Logo`, () => {
  it(`should render the wordmark by default`, () => {
    const { container } = render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>
    );

    const wordmark = container.querySelector(`.${styles.wordmark}`);
    expect(wordmark?.textContent).toBe(`Inbox Assistant`);
  });

  it(`should hide the wordmark when showWordmark is false`, () => {
    const { container } = render(
      <MemoryRouter>
        <Logo showWordmark={false} />
      </MemoryRouter>
    );

    const wordmark = container.querySelector(`.${styles.wordmark}`);
    expect(wordmark).toBeFalsy();
  });

  it(`should apply the size class matching the size prop`, () => {
    const { container } = render(
      <MemoryRouter>
        <Logo size="lg" />
      </MemoryRouter>
    );

    const logo = container.querySelector(`.${styles.logo}`);
    expect(logo?.className).toContain(styles.lg);
  });

  it(`should render a link when href is provided`, () => {
    const { container } = render(
      <MemoryRouter>
        <Logo href="/dashboard" />
      </MemoryRouter>
    );

    const link = container.querySelector(`a`);
    expect(link?.getAttribute(`href`)).toBe(`/dashboard`);
  });

  it(`should not render a link when href is not provided`, () => {
    const { container } = render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>
    );

    const link = container.querySelector(`a`);
    expect(link).toBeFalsy();
  });

  it(`should render the glyph icon`, () => {
    const { container } = render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>
    );

    const glyph = container.querySelector(`.${styles.glyph}`);
    expect(glyph).toBeTruthy();
  });
});
