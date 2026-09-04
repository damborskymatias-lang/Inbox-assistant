import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Skeleton } from './skeleton.js';
import { SkeletonList } from './skeleton-list.js';
import styles from './skeleton.module.scss';
import listStyles from './skeleton-list.module.scss';

describe('Skeleton', () => {
  it('should render a single skeleton element for the default text variant', () => {
    const { container } = render(
      <MemoryRouter>
        <Skeleton />
      </MemoryRouter>
    );

    const elements = container.querySelectorAll(`.${styles.skeleton}`);
    expect(elements.length).toBe(1);
  });

  it('should render multiple lines when variant is text and lines is greater than 1', () => {
    const { container } = render(
      <MemoryRouter>
        <Skeleton variant="text" lines={4} />
      </MemoryRouter>
    );

    const elements = container.querySelectorAll(`.${styles.text}`);
    expect(elements.length).toBe(4);
  });

  it('should render a circle variant with the circle class', () => {
    const { container } = render(
      <MemoryRouter>
        <Skeleton variant="circle" width={40} height={40} />
      </MemoryRouter>
    );

    const element = container.querySelector(`.${styles.circle}`);
    expect(element).toBeTruthy();
  });

  it('should apply a custom className to the root element', () => {
    const { container } = render(
      <MemoryRouter>
        <Skeleton className="custom-class" />
      </MemoryRouter>
    );

    const element = container.querySelector('.custom-class');
    expect(element).toBeTruthy();
  });
});

describe('SkeletonList', () => {
  it('should render the default number of email rows', () => {
    const { container } = render(
      <MemoryRouter>
        <SkeletonList variant="email" />
      </MemoryRouter>
    );

    const rows = container.querySelectorAll(`.${listStyles.emailRow}`);
    expect(rows.length).toBe(4);
  });

  it('should render a custom count of panel tiles', () => {
    const { container } = render(
      <MemoryRouter>
        <SkeletonList variant="panel" count={2} />
      </MemoryRouter>
    );

    const tiles = container.querySelectorAll(`.${listStyles.panelTile}`);
    expect(tiles.length).toBe(2);
  });
});
