import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import { Textarea } from './textarea.js';
import styles from './textarea.module.scss';

describe('Textarea', () => {
  it('renders the label and placeholder', () => {
    const { container } = render(
      <MemoryRouter>
        <Textarea label="Reply" placeholder="Write your reply..." />
      </MemoryRouter>
    );

    const label = container.querySelector(`.${styles.label}`);
    const textarea = container.querySelector('textarea');

    expect(label?.textContent).toContain('Reply');
    expect(textarea?.getAttribute('placeholder')).toBe('Write your reply...');
  });

  it('calls onChange with the next value when typing', () => {
    const handleChange = vi.fn();

    const { container } = render(
      <MemoryRouter>
        <Textarea label="Reply" value="" onChange={handleChange} />
      </MemoryRouter>
    );

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Hello there' } });

    expect(handleChange).toHaveBeenCalledWith('Hello there');
  });

  it('applies the error class and renders the error message', () => {
    const { container } = render(
      <MemoryRouter>
        <Textarea label="Reply" error="This field is required" />
      </MemoryRouter>
    );

    const textarea = container.querySelector('textarea');

    expect(textarea?.className).toContain(styles.textareaError);
    expect(container.textContent).toContain('This field is required');
  });

  it('shows the character count when showCount is enabled', () => {
    const { container } = render(
      <MemoryRouter>
        <Textarea label="Reply" value="Hello" onChange={() => {}} showCount maxLength={100} />
      </MemoryRouter>
    );

    const count = container.querySelector(`.${styles.count}`);
    expect(count?.textContent).toBe('5/100');
  });
});
