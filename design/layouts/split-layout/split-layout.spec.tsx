import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SplitLayout } from './split-layout.js';
import styles from './split-layout.module.scss';

it('renders the list content', () => {
  const { container } = render(
    <MemoryRouter>
      <SplitLayout list={<span>List content</span>} detail={<span>Detail content</span>} />
    </MemoryRouter>
  );

  const listColumn = container.querySelector(`.${styles.list}`);
  expect(listColumn?.textContent).toContain('List content');
});

it('renders the detail content when a selection exists', () => {
  const { container } = render(
    <MemoryRouter>
      <SplitLayout list={<span>List content</span>} detail={<span>Detail content</span>} hasSelection />
    </MemoryRouter>
  );

  const detailColumn = container.querySelector(`.${styles.detail}`);
  expect(detailColumn?.textContent).toContain('Detail content');
});

it('does not render the detail column when there is no selection', () => {
  const { container } = render(
    <MemoryRouter>
      <SplitLayout list={<span>List content</span>} detail={<span>Detail content</span>} hasSelection={false} />
    </MemoryRouter>
  );

  const detailColumn = container.querySelector(`.${styles.detail}`);
  expect(detailColumn).toBeNull();
});

it('applies the sticky class when stickyDetail is true', () => {
  const { container } = render(
    <MemoryRouter>
      <SplitLayout list={<span>List content</span>} detail={<span>Detail content</span>} stickyDetail />
    </MemoryRouter>
  );

  const detailColumn = container.querySelector(`.${styles.detail}`);
  expect(detailColumn?.classList.contains(styles.sticky)).toBe(true);
});

it('applies a custom class name to the root container', () => {
  const { container } = render(
    <MemoryRouter>
      <SplitLayout
        className="custom-split"
        list={<span>List content</span>}
        detail={<span>Detail content</span>}
      />
    </MemoryRouter>
  );

  const root = container.querySelector('.custom-split');
  expect(root).toBeTruthy();
});
