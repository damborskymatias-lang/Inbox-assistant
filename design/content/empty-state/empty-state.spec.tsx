import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EmptyState } from './empty-state.js';
import styles from './empty-state.module.scss';

describe('EmptyState', () => {
  it('renders the title and description', () => {
    const { container } = render(
      <MemoryRouter>
        <EmptyState title="No email selected" description="Pick an email to read it." />
      </MemoryRouter>
    );

    const title = container.querySelector(`.${styles.title}`);
    const description = container.querySelector(`.${styles.description}`);

    expect(title?.textContent).toBe('No email selected');
    expect(description?.textContent).toBe('Pick an email to read it.');
  });

  it('renders the provided icon content', () => {
    const { container } = render(
      <MemoryRouter>
        <EmptyState icon="🎉" title="Inbox zero" />
      </MemoryRouter>
    );

    const icon = container.querySelector(`.${styles.icon}`);

    expect(icon?.textContent).toBe('🎉');
  });

  it('does not render an action when actionLabel is not provided', () => {
    const { container } = render(
      <MemoryRouter>
        <EmptyState title="Nothing here" />
      </MemoryRouter>
    );

    const action = container.querySelector(`.${styles.action}`);

    expect(action).toBeNull();
  });

  it('calls onAction when the action button is clicked', () => {
    const onAction = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <EmptyState title="No email selected" actionLabel="Open first email" onAction={onAction} />
      </MemoryRouter>
    );

    const button = container.querySelector('button');
    fireEvent.click(button as HTMLButtonElement);

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('applies a custom className', () => {
    const { container } = render(
      <MemoryRouter>
        <EmptyState title="No email selected" className="custom-class" />
      </MemoryRouter>
    );

    const root = container.querySelector(`.${styles.emptyState}`);

    expect(root?.classList.contains('custom-class')).toBe(true);
  });
});
