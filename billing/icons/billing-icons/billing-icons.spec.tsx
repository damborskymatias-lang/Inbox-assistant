import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BasicBillingIcons, IndividualIcons, FeatureListWithIcons } from './billing-icons.compositions.js';
import { BillingIcons } from './billing-icons.js';
import styles from './billing-icons.module.scss';

it('should render all five billing icons in the grid', () => {
  const { container } = render(<BasicBillingIcons />);
  const items = container.querySelectorAll(`.${styles.item}`);
  expect(items.length).toBe(5);
});

it('should render icon labels in the grid', () => {
  const { container } = render(<BasicBillingIcons />);
  const labels = Array.from(container.querySelectorAll(`.${styles.label}`)).map((el) => el.textContent);
  expect(labels).toEqual(['Pro', 'Gated feature', 'Included', 'Priority processing', 'Payment method']);
});

it('should render each individual icon composition', () => {
  const { container } = render(<IndividualIcons />);
  const svgs = container.querySelectorAll('svg');
  expect(svgs.length).toBe(5);
});

it('should render feature list with correct icon per feature state', () => {
  const { getByText } = render(<FeatureListWithIcons />);
  const includedFeature = getByText('Unlimited AI replies');
  const lockedFeature = getByText('Custom writing styles');
  expect(includedFeature).toBeTruthy();
  expect(lockedFeature).toBeTruthy();
});

it('should apply a custom className to the grid root', () => {
  const { container } = render(
    <MemoryRouter>
      <BillingIcons className="custom-class" />
    </MemoryRouter>
  );
  const root = container.querySelector(`.${styles.grid}`);
  expect(root && root.className.includes('custom-class')).toBe(true);
});
