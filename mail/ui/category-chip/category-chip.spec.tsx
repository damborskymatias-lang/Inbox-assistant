import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { InboxTheme } from '@lov/design.inbox-theme';
import { CategoryChip } from './category-chip.js';
import { ImportanceBadge } from './importance-badge.js';

describe(`CategoryChip`, () => {
  it(`renders the label and emoji for a category`, () => {
    const { container } = render(
      <MemoryRouter>
        <InboxTheme>
          <CategoryChip category="urgent" />
        </InboxTheme>
      </MemoryRouter>
    );

    expect(container.textContent).toContain(`Urgent`);
    expect(container.textContent).toContain(`🔴`);
  });

  it(`renders the work category by default`, () => {
    const { container } = render(
      <MemoryRouter>
        <InboxTheme>
          <CategoryChip />
        </InboxTheme>
      </MemoryRouter>
    );

    expect(container.textContent).toContain(`Work`);
  });

  it(`applies a custom class name`, () => {
    const { container } = render(
      <MemoryRouter>
        <InboxTheme>
          <CategoryChip category="family" className="my-chip" />
        </InboxTheme>
      </MemoryRouter>
    );

    const chip = container.querySelector(`.my-chip`);
    expect(chip).toBeTruthy();
  });
});

describe(`ImportanceBadge`, () => {
  it(`renders the score text`, () => {
    const { container } = render(
      <MemoryRouter>
        <InboxTheme>
          <ImportanceBadge score={7} />
        </InboxTheme>
      </MemoryRouter>
    );

    expect(container.textContent).toContain(`importance 7/10`);
  });

  it(`clamps scores above the maximum`, () => {
    const { container } = render(
      <MemoryRouter>
        <InboxTheme>
          <ImportanceBadge score={15} />
        </InboxTheme>
      </MemoryRouter>
    );

    expect(container.textContent).toContain(`importance 10/10`);
  });

  it(`clamps scores below the minimum`, () => {
    const { container } = render(
      <MemoryRouter>
        <InboxTheme>
          <ImportanceBadge score={0} />
        </InboxTheme>
      </MemoryRouter>
    );

    expect(container.textContent).toContain(`importance 1/10`);
  });
});
