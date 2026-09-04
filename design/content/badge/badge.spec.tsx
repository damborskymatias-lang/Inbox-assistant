import React from 'react';
import { render } from '@testing-library/react';
import { Badge } from './badge.js';
import styles from './badge.module.scss';

it('should render the badge label', () => {
  const { container } = render(<Badge tone="urgent">Urgent</Badge>);
  const label = container.querySelector(`.${styles.label}`);
  expect(label?.textContent).toBe('Urgent');
});

it('should render the provided icon', () => {
  const { container } = render(
    <Badge tone="work" icon="💼">
      Work
    </Badge>
  );
  const icon = container.querySelector(`.${styles.icon}`);
  expect(icon?.textContent).toBe('💼');
});

it('should apply the tone class name', () => {
  const { container } = render(<Badge tone="success">Sent</Badge>);
  const badge = container.querySelector(`.${styles.badge}`);
  expect(badge?.className).toContain(styles.success);
});

it('should apply the size class name', () => {
  const { container } = render(
    <Badge tone="neutral" size="xs">
      Small
    </Badge>
  );
  const badge = container.querySelector(`.${styles.badge}`);
  expect(badge?.className).toContain(styles.xs);
});

it('should apply a custom class name', () => {
  const { container } = render(
    <Badge tone="neutral" className="custom-class">
      Custom
    </Badge>
  );
  const badge = container.querySelector('.custom-class');
  expect(badge).toBeTruthy();
});

it('should render without children', () => {
  const { container } = render(<Badge tone="neutral" icon="🔴" />);
  const badge = container.querySelector(`.${styles.badge}`);
  expect(badge).toBeTruthy();
});
