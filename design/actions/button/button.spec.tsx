import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Button } from './button.js';
import styles from './button.module.scss';

describe('Button', () => {
  it('renders the provided label', () => {
    const { container } = render(
      <MemoryRouter>
        <Button>Send reply</Button>
      </MemoryRouter>
    );

    const label = container.querySelector(`.${styles.label}`);
    expect(label?.textContent).toBe('Send reply');
  });

  it('applies the variant and size class names', () => {
    const { container } = render(
      <MemoryRouter>
        <Button variant="danger" size="lg">
          Archive all
        </Button>
      </MemoryRouter>
    );

    const button = container.querySelector('button');
    expect(button?.className).toContain(styles.danger);
    expect(button?.className).toContain(styles.lg);
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <Button onClick={() => onClick()}>Click me</Button>
      </MemoryRouter>
    );

    const button = container.querySelector('button') as HTMLButtonElement;
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <Button disabled onClick={() => onClick()}>
          Click me
        </Button>
      </MemoryRouter>
    );

    const button = container.querySelector('button') as HTMLButtonElement;
    fireEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
    expect(button.disabled).toBe(true);
  });

  it('shows a spinner and disables the button while loading', () => {
    const { container } = render(
      <MemoryRouter>
        <Button loading>Sending</Button>
      </MemoryRouter>
    );

    const button = container.querySelector('button') as HTMLButtonElement;
    const spinner = container.querySelector(`.${styles.spinner}`);

    expect(spinner).not.toBeNull();
    expect(button.disabled).toBe(true);
  });

  it('renders as a link when href is provided', () => {
    const { container } = render(
      <MemoryRouter>
        <Button href="/dashboard">Go to Dashboard</Button>
      </MemoryRouter>
    );

    const link = container.querySelector('a');
    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBe('/dashboard');
  });

  it('does not render as a link when disabled even with href', () => {
    const { container } = render(
      <MemoryRouter>
        <Button href="/dashboard" disabled>
          Go to Dashboard
        </Button>
      </MemoryRouter>
    );

    const link = container.querySelector('a');
    const button = container.querySelector('button');
    expect(link).toBeNull();
    expect(button).not.toBeNull();
  });
});
