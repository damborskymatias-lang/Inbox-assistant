import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Avatar } from './avatar.js';
import styles from './avatar.module.scss';

describe(`Avatar`, () => {
  it(`should render initials from a two word name`, () => {
    const { container } = render(
      <MemoryRouter>
        <Avatar name="Peter Cole" />
      </MemoryRouter>
    );

    const initials = container.querySelector(`.${styles.initials}`);
    expect(initials?.textContent).toBe(`PC`);
  });

  it(`should render initials from a single word name`, () => {
    const { container } = render(
      <MemoryRouter>
        <Avatar name="Madonna" />
      </MemoryRouter>
    );

    const initials = container.querySelector(`.${styles.initials}`);
    expect(initials?.textContent).toBe(`MA`);
  });

  it(`should render an image instead of initials when src is provided`, () => {
    const { container } = render(
      <MemoryRouter>
        <Avatar name="Peter Cole" src="https://example.com/avatar.png" />
      </MemoryRouter>
    );

    const image = container.querySelector(`.${styles.image}`);
    const initials = container.querySelector(`.${styles.initials}`);
    expect(image).toBeTruthy();
    expect(initials).toBeFalsy();
  });

  it(`should apply the size class matching the size prop`, () => {
    const { container } = render(
      <MemoryRouter>
        <Avatar name="Peter Cole" size="lg" />
      </MemoryRouter>
    );

    const avatar = container.querySelector(`.${styles.avatar}`);
    expect(avatar?.className).toContain(styles.lg);
  });

  it(`should derive the same background color for the same name`, () => {
    const first = render(
      <MemoryRouter>
        <Avatar name="Amelia Grant" />
      </MemoryRouter>
    );
    const second = render(
      <MemoryRouter>
        <Avatar name="Amelia Grant" />
      </MemoryRouter>
    );

    const firstAvatar = first.container.querySelector(`.${styles.avatar}`) as HTMLElement;
    const secondAvatar = second.container.querySelector(`.${styles.avatar}`) as HTMLElement;
    expect(firstAvatar.style.backgroundColor).toBe(secondAvatar.style.backgroundColor);
  });
});
