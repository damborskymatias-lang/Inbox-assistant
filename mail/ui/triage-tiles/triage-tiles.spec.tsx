import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { TriageTiles } from './triage-tiles.js';
import styles from './triage-tiles.module.scss';

describe(`TriageTiles`, () => {
  it(`renders the default triage labels`, () => {
    const { container } = render(
      <MockProvider>
        <TriageTiles />
      </MockProvider>
    );

    expect(container.textContent).toContain(`Urgent`);
    expect(container.textContent).toContain(`Needs Reply`);
    expect(container.textContent).toContain(`FYI`);
    expect(container.textContent).toContain(`Promotions`);
  });

  it(`renders the provided counts`, () => {
    const { container } = render(
      <MockProvider>
        <TriageTiles counts={{ urgent: 7, needsReply: 2, fyi: 9, promotions: 4 }} />
      </MockProvider>
    );

    expect(container.textContent).toContain(`7`);
    expect(container.textContent).toContain(`2`);
    expect(container.textContent).toContain(`9`);
    expect(container.textContent).toContain(`4`);
  });

  it(`calls onSelect with the clicked bucket`, () => {
    const onSelect = vi.fn();

    const { container } = render(
      <MockProvider>
        <TriageTiles onSelect={onSelect} />
      </MockProvider>
    );

    const buttons = container.querySelectorAll(`button`);
    fireEvent.click(buttons[0] as HTMLButtonElement);

    expect(onSelect).toHaveBeenCalledWith(`urgent`);
  });

  it(`calls onSelect with all when the active tile is clicked again`, () => {
    const onSelect = vi.fn();

    const { container } = render(
      <MockProvider>
        <TriageTiles active="urgent" onSelect={onSelect} />
      </MockProvider>
    );

    const buttons = container.querySelectorAll(`button`);
    fireEvent.click(buttons[0] as HTMLButtonElement);

    expect(onSelect).toHaveBeenCalledWith(`all`);
  });

  it(`renders skeleton placeholders while loading`, () => {
    const { container } = render(
      <MockProvider>
        <TriageTiles loading />
      </MockProvider>
    );

    expect(container.querySelectorAll(`button`).length).toBe(0);
  });

  it(`applies a custom class name`, () => {
    const { container } = render(
      <MockProvider>
        <TriageTiles className="my-tiles" />
      </MockProvider>
    );

    const root = container.querySelector(`.my-tiles`);
    expect(root).toBeTruthy();
    expect(root?.classList.contains(styles.tiles)).toBe(true);
  });
});
