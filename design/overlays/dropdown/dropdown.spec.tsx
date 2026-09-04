import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Dropdown } from './dropdown.js';
import styles from './dropdown.module.scss';

it('should not render the content by default', () => {
  const { container } = render(
    <MemoryRouter>
      <Dropdown trigger={<button type="button">Open menu</button>}>
        <button type="button">Item one</button>
      </Dropdown>
    </MemoryRouter>
  );

  const content = container.querySelector(`.${styles.content}`);
  expect(content).toBeFalsy();
});

it('should open the content when the trigger is clicked', () => {
  const { container } = render(
    <MemoryRouter>
      <Dropdown trigger={<button type="button">Open menu</button>}>
        <button type="button">Item one</button>
      </Dropdown>
    </MemoryRouter>
  );

  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLElement;
  fireEvent.click(trigger);

  const content = container.querySelector(`.${styles.content}`);
  expect(content).toBeTruthy();
});

it('should close the content when the Escape key is pressed', () => {
  const { container } = render(
    <MemoryRouter>
      <Dropdown trigger={<button type="button">Open menu</button>}>
        <button type="button">Item one</button>
      </Dropdown>
    </MemoryRouter>
  );

  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLElement;
  fireEvent.click(trigger);
  expect(container.querySelector(`.${styles.content}`)).toBeTruthy();

  fireEvent.keyDown(document, { key: 'Escape' });

  const content = container.querySelector(`.${styles.content}`);
  expect(content).toBeFalsy();
});

it('should close the content on an outside click', () => {
  const { container } = render(
    <MemoryRouter>
      <div>
        <Dropdown trigger={<button type="button">Open menu</button>}>
          <button type="button">Item one</button>
        </Dropdown>
        <div className="outside-area">Outside</div>
      </div>
    </MemoryRouter>
  );

  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLElement;
  fireEvent.click(trigger);
  expect(container.querySelector(`.${styles.content}`)).toBeTruthy();

  const outside = container.querySelector('.outside-area') as HTMLElement;
  fireEvent.mouseDown(outside);

  const content = container.querySelector(`.${styles.content}`);
  expect(content).toBeFalsy();
});

it('should call onOpenChange when the trigger is clicked in controlled mode', () => {
  let openValue = false;
  const handleOpenChange = (nextOpen: boolean) => {
    openValue = nextOpen;
  };

  const { container } = render(
    <MemoryRouter>
      <Dropdown open={false} onOpenChange={handleOpenChange} trigger={<button type="button">Open menu</button>}>
        <button type="button">Item one</button>
      </Dropdown>
    </MemoryRouter>
  );

  const trigger = container.querySelector(`.${styles.trigger}`) as HTMLElement;
  fireEvent.click(trigger);

  expect(openValue).toBe(true);
});
