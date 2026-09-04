import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConfirmDialog } from './confirm-dialog.js';
import styles from './confirm-dialog.module.scss';

it('should render nothing when open is false', () => {
  const { container } = render(
    <MemoryRouter>
      <ConfirmDialog open={false} />
    </MemoryRouter>
  );

  expect(container.querySelector(`.${styles.backdrop}`)).toBeNull();
});

it('should render the title and description when open', () => {
  const { getByText } = render(
    <MemoryRouter>
      <ConfirmDialog
        open
        title="Archive 42 newsletters?"
        description="This will move them out of your inbox."
      />
    </MemoryRouter>
  );

  expect(getByText('Archive 42 newsletters?')).toBeTruthy();
  expect(getByText('This will move them out of your inbox.')).toBeTruthy();
});

it('should call onConfirm when the confirm button is clicked', () => {
  const handleConfirm = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <ConfirmDialog open confirmLabel="Archive all" onConfirm={() => handleConfirm()} />
    </MemoryRouter>
  );

  const buttons = container.querySelectorAll('button');
  const confirmButton = Array.from(buttons).find((button) => button.textContent === 'Archive all');
  fireEvent.click(confirmButton as HTMLButtonElement);

  expect(handleConfirm).toHaveBeenCalledTimes(1);
});

it('should call onCancel when the cancel button is clicked', () => {
  const handleCancel = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <ConfirmDialog open cancelLabel="Cancel" onCancel={() => handleCancel()} />
    </MemoryRouter>
  );

  const buttons = container.querySelectorAll('button');
  const cancelButton = Array.from(buttons).find((button) => button.textContent === 'Cancel');
  fireEvent.click(cancelButton as HTMLButtonElement);

  expect(handleCancel).toHaveBeenCalledTimes(1);
});

it('should call onCancel when the backdrop is clicked', () => {
  const handleCancel = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <ConfirmDialog open onCancel={() => handleCancel()} />
    </MemoryRouter>
  );

  const backdrop = container.querySelector(`.${styles.backdrop}`);
  fireEvent.click(backdrop as HTMLDivElement);

  expect(handleCancel).toHaveBeenCalledTimes(1);
});

it('should not call onCancel when the backdrop is clicked while loading', () => {
  const handleCancel = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <ConfirmDialog open loading onCancel={() => handleCancel()} />
    </MemoryRouter>
  );

  const backdrop = container.querySelector(`.${styles.backdrop}`);
  fireEvent.click(backdrop as HTMLDivElement);

  expect(handleCancel).not.toHaveBeenCalled();
});
