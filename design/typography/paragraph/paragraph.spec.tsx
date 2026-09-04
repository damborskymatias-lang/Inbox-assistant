import React from 'react';
import { render } from '@testing-library/react';
import { Paragraph } from './paragraph.js';
import styles from './paragraph.module.scss';

describe('Paragraph', () => {
  it('should render its children', () => {
    const { container } = render(<Paragraph>Helper text example</Paragraph>);
    const paragraph = container.querySelector('p');
    expect(paragraph?.textContent).toBe('Helper text example');
  });

  it('should apply the default size and tone classes', () => {
    const { container } = render(<Paragraph>Default paragraph</Paragraph>);
    const paragraph = container.querySelector('p');
    expect(paragraph?.className).toContain(styles.md);
    expect(paragraph?.className).toContain(styles.default);
  });

  it('should apply the size, tone and weight classes provided', () => {
    const { container } = render(
      <Paragraph size="lg" tone="danger" weight="bold">
        Warning message
      </Paragraph>
    );
    const paragraph = container.querySelector('p');
    expect(paragraph?.className).toContain(styles.lg);
    expect(paragraph?.className).toContain(styles.danger);
    expect(paragraph?.className).toContain(styles.bold);
  });

  it('should apply the truncate class and clamp style when truncate is provided', () => {
    const { container } = render(<Paragraph truncate={3}>Long summary text</Paragraph>);
    const paragraph = container.querySelector('p') as HTMLParagraphElement;
    expect(paragraph.className).toContain(styles.truncate);
    expect(paragraph.style.getPropertyValue('--truncate-lines')).toBe('3');
  });

  it('should apply a custom class name', () => {
    const { container } = render(<Paragraph className="custom-class">Text</Paragraph>);
    const paragraph = container.querySelector('p');
    expect(paragraph?.className).toContain('custom-class');
  });
});
