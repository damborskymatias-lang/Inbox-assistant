import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TextInput } from './text-input.js';
import styles from './text-input.module.scss';

describe(`TextInput`, () => {
  it(`renders the provided label`, () => {
    const { container } = render(
      <MemoryRouter>
        <TextInput label="Full name" />
      </MemoryRouter>
    );

    const label = container.querySelector(`label`);
    expect(label?.textContent).toBe(`Full name`);
  });

  it(`renders helper text when no error is present`, () => {
    const { container } = render(
      <MemoryRouter>
        <TextInput helperText="This is a helper" />
      </MemoryRouter>
    );

    const helper = container.querySelector(`.${styles.helperText}`);
    expect(helper?.textContent).toBe(`This is a helper`);
  });

  it(`renders the error message instead of the helper text and applies the error class`, () => {
    const { container } = render(
      <MemoryRouter>
        <TextInput helperText="This is a helper" error="Something went wrong" />
      </MemoryRouter>
    );

    const helper = container.querySelector(`.${styles.helperText}`);
    expect(helper?.textContent).toBe(`Something went wrong`);

    const wrapper = container.querySelector(`.${styles.inputWrapper}`);
    expect(wrapper?.className).toContain(styles.hasError);
  });

  it(`calls onChange with the new value when the user types`, () => {
    const onChange = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <TextInput onChange={onChange} />
      </MemoryRouter>
    );

    const input = container.querySelector(`input`) as HTMLInputElement;
    fireEvent.change(input, { target: { value: `hello` } });

    expect(onChange).toHaveBeenCalledWith(`hello`);
    expect(input.value).toBe(`hello`);
  });

  it(`shows a clear button only when clearable and a value is present, and clears the value on click`, () => {
    const onClear = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <TextInput clearable defaultValue="search term" onClear={onClear} />
      </MemoryRouter>
    );

    const clearButton = container.querySelector(`.${styles.clearButton}`);
    expect(clearButton).not.toBeNull();

    fireEvent.click(clearButton as Element);

    const input = container.querySelector(`input`) as HTMLInputElement;
    expect(input.value).toBe(``);
    expect(onClear).toHaveBeenCalled();
  });

  it(`does not render a clear button when the input is empty`, () => {
    const { container } = render(
      <MemoryRouter>
        <TextInput clearable defaultValue="" />
      </MemoryRouter>
    );

    const clearButton = container.querySelector(`.${styles.clearButton}`);
    expect(clearButton).toBeNull();
  });
});
